import NextAuth from 'next-auth';
import TwitchProvider from 'next-auth/providers/twitch';
import { prisma } from '@/lib/prisma';

const handler = NextAuth({
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_AUTH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_AUTH_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.id) return false;

      // Upsert user in database
      await prisma.user.upsert({
        where: { twitchId: user.id },
        update: {
          username: user.name || 'Unknown',
          profilePicture: user.image || null,
        },
        create: {
          twitchId: user.id,
          username: user.name || 'Unknown',
          profilePicture: user.image || null,
        },
      });

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Add twitchId to session
        (session.user as any).twitchId = token.sub;

        // Get user from DB
        const dbUser = await prisma.user.findUnique({
          where: { twitchId: token.sub },
        });

        if (dbUser) {
          (session.user as any).id = dbUser.id;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/ideas',
  },
});

export { handler as GET, handler as POST };
