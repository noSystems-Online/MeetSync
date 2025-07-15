import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add your own logic here to find the user from the credentials.
        // For demo purposes, we'll just return a static user.
        if (credentials.username === 'admin' && credentials.password === 'admin') {
          return { id: '1', name: 'Admin', email: 'admin@example.com' }
        }
        return null
      }
    })
  ],
})

export { handler as GET, handler as POST }
