import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { createCheckoutSession, isStripeConfigured, verifyWebhookSignature } from '../utils/stripe';
import Stripe from 'stripe';

/**
 * Create Stripe checkout session
 */
export async function createCheckout(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Payment processing is not configured',
      });
    }

    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required',
      });
    }

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    if (!course.published) {
      return res.status(400).json({
        success: false,
        message: 'Course is not available for purchase',
      });
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
      });
    }

    // Create Stripe checkout session
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const session = await createCheckoutSession(
      courseId,
      course.title,
      course.price,
      req.user.userId,
      `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      `${frontendUrl}/courses/${courseId}`
    );

    return res.status(200).json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    console.error('Create checkout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
    });
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhook(req: Request, res: Response) {
  try {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing stripe signature',
      });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(req.body, signature);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).json({
        success: false,
        message: 'Invalid signature',
      });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Extract metadata
        const courseId = session.metadata?.courseId;
        const userId = session.metadata?.userId;

        if (!courseId || !userId) {
          console.error('Missing metadata in checkout session');
          break;
        }

        // Create enrollment
        try {
          await prisma.enrollment.create({
            data: {
              userId,
              courseId,
              stripeSessionId: session.id,
            },
          });

          console.log(`✅ Enrollment created for user ${userId} in course ${courseId}`);
        } catch (error: any) {
          // Handle duplicate enrollment (user might have been enrolled manually)
          if (error.code === 'P2002') {
            console.log(`Enrollment already exists for user ${userId} in course ${courseId}`);
          } else {
            console.error('Failed to create enrollment:', error);
          }
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Checkout session expired: ${session.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({
      success: false,
      message: 'Webhook handler failed',
    });
  }
}

/**
 * Get user enrollments
 */
export async function getEnrollments(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.userId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            _count: {
              select: {
                lessons: true,
              },
            },
          },
        },
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      data: { enrollments },
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

/**
 * Check if user is enrolled in a course
 */
export async function checkEnrollment(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { courseId } = req.params;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.userId,
          courseId,
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        isEnrolled: !!enrollment,
        enrollment: enrollment || null,
      },
    });
  } catch (error) {
    console.error('Check enrollment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
