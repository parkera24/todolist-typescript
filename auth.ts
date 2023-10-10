import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import type { NextAuthOptions as NextAuthConfig } from "next-auth"
import { getServerSession } from "next-auth"
import GitHub from "next-auth/providers/github"


declare module "next-auth/jwt" {
    interface JWT {
        userRole?: "admin"
    }
}

export const config = {
    providers: [
        GitHub({ clientId: process.env.AUTH_GITHUB_ID, clientSecret: process.env.AUTH_GITHUB_SECRET }),
    ],
    callbacks: {
        async jwt({token}) {
            token.userRole = "admin"
            return token
        },
    },
} satisifies NextAuthConfig

// Helper function to get session without passing config every time
// https://next-auth.js.org/configuration/nextjs#getserversession
export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
    return getServerSession(...args, config)
  }

  declare global {
    namespace NodeJS {
      export interface ProcessEnv {
        NEXTAUTH_SECRET: string
        AUTH_GITHUB_ID: string
        AUTH_GITHUB_SECRET: string
        
      }
    }
  }