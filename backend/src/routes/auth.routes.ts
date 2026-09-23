import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, User, Membership } from '../data/db.js';
import { config } from '../config/index.js';
import { validateBody, rateLimiter } from '../middleware/validationMiddleware.js';
import { signUpSchema, signInSchema, refreshTokenSchema, resetPasswordSchema } from '../schemas/index.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const authRouter = Router();

// Sign In
authRouter.post('/signin', rateLimiter(30, 60000), validateBody(signInSchema), (req, res: Response): void => {
  const { email, password } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    res.status(401).json({ success: false, error: 'Invalid email or password' });
    return;
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({ success: false, error: 'Invalid email or password' });
    return;
  }

  const membership = db.memberships.find((m) => m.userId === user.id);
  const organizationId = membership?.organizationId || db.organizations[0].id;
  const role = membership?.role || 'AGENCY_ADMIN';
  const org = db.organizations.find((o) => o.id === organizationId);

  const token = jwt.sign(
    { userId: user.id, organizationId, role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as any }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, organizationId },
    config.jwtRefreshSecret,
    { expiresIn: config.jwtRefreshExpiresIn as any }
  );

  res.json({
    success: true,
    data: {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role,
        organizationId,
        organizationName: org?.name || 'Genie Media & Studio',
      },
    },
  });
});

// Sign Up
authRouter.post('/signup', rateLimiter(15, 60000), validateBody(signUpSchema), (req, res: Response): void => {
  const { name, email, password, orgName } = req.body;
  const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    res.status(400).json({ success: false, error: 'An account with this email already exists' });
    return;
  }

  const now = new Date().toISOString();
  let org = db.organizations.find((o) => o.name.toLowerCase() === orgName.toLowerCase());

  if (!org) {
    org = {
      id: `org-${Date.now()}`,
      name: orgName,
      slug: orgName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      location: 'Visakhapatnam, India',
      createdAt: now,
      updatedAt: now,
    };
    db.organizations.push(org);
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 8),
    createdAt: now,
    updatedAt: now,
  };

  db.users.push(newUser);

  const newMembership: Membership = {
    id: `mem-${Date.now()}`,
    organizationId: org.id,
    userId: newUser.id,
    role: 'AGENCY_ADMIN',
    createdAt: now,
  };

  db.memberships.push(newMembership);

  const token = jwt.sign(
    { userId: newUser.id, organizationId: org.id, role: newMembership.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as any }
  );

  const refreshToken = jwt.sign(
    { userId: newUser.id, organizationId: org.id },
    config.jwtRefreshSecret,
    { expiresIn: config.jwtRefreshExpiresIn as any }
  );

  res.status(201).json({
    success: true,
    data: {
      token,
      refreshToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newMembership.role,
        organizationId: org.id,
        organizationName: org.name,
      },
    },
  });
});

// Refresh Token
authRouter.post('/refresh', validateBody(refreshTokenSchema), (req, res: Response): void => {
  const { refreshToken } = req.body;
  try {
    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as { userId: string; organizationId: string };
    const user = db.users.find((u) => u.id === decoded.userId);
    const membership = db.memberships.find(
      (m) => m.userId === decoded.userId && m.organizationId === decoded.organizationId
    );

    if (!user || !membership) {
      res.status(401).json({ success: false, error: 'Invalid refresh token' });
      return;
    }

    const newToken = jwt.sign(
      { userId: user.id, organizationId: membership.organizationId, role: membership.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    );

    res.json({
      success: true,
      data: { token: newToken },
    });
  } catch (err) {
    res.status(401).json({ success: false, error: 'Expired or invalid refresh token' });
  }
});

// Reset Password
authRouter.post('/reset-password', validateBody(resetPasswordSchema), (req, res: Response): void => {
  const { email, newPassword } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // Return friendly message even if user not found for security
    res.json({ success: true, message: 'If an account with that email exists, the password has been reset.' });
    return;
  }

  user.passwordHash = bcrypt.hashSync(newPassword, 8);
  user.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Password has been successfully updated. You may now sign in with your new credentials.',
  });
});

// Get Current User Profile
authRouter.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const membership = req.membership!;
  const org = db.organizations.find((o) => o.id === membership.organizationId);

  res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: membership.role,
      organizationId: membership.organizationId,
      organizationName: org?.name || 'Genie Media & Studio',
      organizationLocation: org?.location,
    },
  });
});
