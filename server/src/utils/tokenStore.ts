/**
 * In-memory token store for refresh tokens
 * In production, use Redis or database for persistence
 */

interface TokenData {
  userId: string;
  token: string;
  expiresAt: Date;
}

class TokenStore {
  private tokens: Map<string, TokenData> = new Map();

  /**
   * Store a refresh token
   */
  store(userId: string, token: string, expiresInDays: number = 7): void {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    this.tokens.set(token, {
      userId,
      token,
      expiresAt,
    });

    // Clean up expired tokens periodically
    this.cleanupExpired();
  }

  /**
   * Verify if a refresh token exists and is valid
   */
  verify(token: string): boolean {
    const tokenData = this.tokens.get(token);
    
    if (!tokenData) {
      return false;
    }

    if (tokenData.expiresAt < new Date()) {
      this.tokens.delete(token);
      return false;
    }

    return true;
  }

  /**
   * Get user ID from refresh token
   */
  getUserId(token: string): string | null {
    const tokenData = this.tokens.get(token);
    return tokenData?.userId || null;
  }

  /**
   * Revoke a refresh token
   */
  revoke(token: string): void {
    this.tokens.delete(token);
  }

  /**
   * Revoke all tokens for a user
   */
  revokeAllForUser(userId: string): void {
    for (const [token, data] of this.tokens.entries()) {
      if (data.userId === userId) {
        this.tokens.delete(token);
      }
    }
  }

  /**
   * Clean up expired tokens
   */
  private cleanupExpired(): void {
    const now = new Date();
    for (const [token, data] of this.tokens.entries()) {
      if (data.expiresAt < now) {
        this.tokens.delete(token);
      }
    }
  }

  /**
   * Get total number of active tokens
   */
  size(): number {
    return this.tokens.size;
  }
}

// Export singleton instance
export const tokenStore = new TokenStore();
