"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
        <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.686H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"/>
        <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.34 221.722 77.535 261.1 130.55 261.1"/>
        <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.615.032C5.904 89.227 1 109.524 1 130.55s4.904 41.323 12.743 58.217l43.538-33.414z"/>
        <path fill="#EB4335" d="M130.55 50.479c19.205 0 36.344 6.698 50.073 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 77.535 0 35.34 39.378 13.686 91.229l42.682 33.32z"/>
    </svg>
);

const GithubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path fill="#181717" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.332-1.756-1.332-1.756-1.088-.745.082-.729.082-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.3-.54-1.52.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.656.24 2.876.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.627 0 12 0z"/>
    </svg>
);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center p-8 font-sans bg-background relative overflow-hidden">
      {/* --- ĐÃ SỬA: Tăng kích thước và độ sáng cho các đốm màu nền --- */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl" />
      </div>

      <motion.div 
        className="w-full max-w-md bg-card/80 backdrop-blur-sm border p-8 sm:p-10 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
          <div className="space-y-8">
              <div className="text-center flex flex-col items-center gap-3">
                  <Image src="/logo/dark.png" alt="Vision2Reality Logo" width={40} height={40} />
                  <h1 className="text-xl font-semibold text-foreground">Vision2Reality</h1>
              </div>

              <div className="space-y-6">
                  <div className="space-y-2 text-center">
                      <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
                      <p className="text-muted-foreground">Enter your email and password to access your account.</p>
                  </div>

                  <div className="space-y-4">
                      <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="user@company.com" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <div className="relative">
                              <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter password" className="pr-10" />
                              <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                              </Button>
                          </div>
                      </div>
                      <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                              <input type="checkbox" id="remember" className="rounded border-border cursor-pointer" />
                              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">Remember Me</Label>
                          </div>
                          <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                              Forgot Password?
                          </Link>
                      </div>
                  </div>
                  
                  <Button className="w-full" variant="default">Log In</Button>
                  
                  <div className="relative">
                      <div className="absolute inset-0 flex items-center"><Separator /></div>
                      <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-12 rounded-lg bg-white text-black hover:bg-gray-100 border-gray-300">
                      <GoogleIcon />
                      <span className="ml-2">Google</span>
                    </Button>
                    <Button variant="outline" className="h-12 rounded-lg bg-[#24292F] text-white hover:bg-[#24292F]/90 border-[#24292F]">
                      <GithubIcon />
                      <span className="ml-2">GitHub</span>
                    </Button>
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                      Don&apos;t Have An Account?{" "}
                      <Link href="/register" className="font-medium text-primary hover:underline">
                          Register Now.
                      </Link>
                  </div>
              </div>
          </div>
      </motion.div>
    </div>
  )
}