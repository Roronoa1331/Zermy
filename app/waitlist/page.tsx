"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Ad ən azı 2 simvol olmalıdır.",
  }),
  surname: z.string().min(2, {
    message: "Soyad ən azı 2 simvol olmalıdır.",
  }),
  email: z.string().email({
    message: "Düzgün email daxil edin.",
  }),
  phone: z.string().min(9, {
    message: "Telefon nömrəsi ən azı 9 rəqəm olmalıdır.",
  }),
});

export default function WaitlistPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '', description: '' });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();

      if (response.ok) {
        setNotification({
          type: 'success',
          message: 'Gözləmə siyahısına əlavə olundunuz!', 
          description: 'Tezliklə sizinlə əlaqə saxlayacağıq.'
        });
        form.reset();
      } else {
        setNotification({
          type: 'error',
          message: 'Xəta baş verdi',
          description: data.error || 'Zəhmət olmasa bir az sonra yenidən cəhd edin.'
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Xəta baş verdi',
        description: 'Zəhmət olmasa bir az sonra yenidən cəhd edin.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gözləmə Siyahısı</h1>
        <p className="text-muted-foreground mb-8">
          İlk istifadəçilərimizdən biri olmaq üçün qeydiyyatdan keçin. Platformamız hazır olduqda sizə bildiriş göndərəcəyik.
        </p>

        {notification.message && (
          <div className={`p-4 mb-6 rounded-md ${notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <p className="font-semibold">{notification.message}</p>
            <p>{notification.description}</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad</FormLabel>
                  <FormControl>
                    <Input placeholder="Adınızı daxil edin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Soyad</FormLabel>
                  <FormControl>
                    <Input placeholder="Soyadınızı daxil edin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email ünvanınızı daxil edin" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input placeholder="Telefon nömrənizi daxil edin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Göndərilir..." : "Qeydiyyatdan keç"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}