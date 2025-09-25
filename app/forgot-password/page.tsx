"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

export default function ForgotPasswordPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast.success("Password reset link sent!", {
      description: `If an account with ${values.email} exists, you will receive an email.`,
    })
    form.reset()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 font-sans bg-background relative overflow-hidden">
      {/* --- ĐÃ SỬA: Tăng kích thước và độ sáng cho các đốm màu nền --- */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl" />
      </div>

      <motion.div 
        className="w-full max-w-md bg-card/80 backdrop-blur-sm border p-8 sm:p-10 rounded-2xl shadow-lg relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Link href="/login" passHref>
          <Button
            variant="ghost"
            className="absolute left-4 top-4 sm:left-8 sm:top-8 p-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Back to Login</span>
          </Button>
        </Link>
        
        <div className="space-y-8 pt-12">
          <div className="text-center flex flex-col items-center gap-3">
            <Image src="/logo/dark.png" alt="Vision2Reality Logo" width={40} height={40} />
            <h1 className="text-xl font-semibold text-foreground">Vision2Reality</h1>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold text-foreground">Reset Password</h2>
              <p className="text-muted-foreground">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="user@company.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" variant="default">
                  Send Reset Link
                </Button>
              </form>
            </Form>
            
            <div className="text-center text-sm text-muted-foreground">
              Remember Your Password?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign In.
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}