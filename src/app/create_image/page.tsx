"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  prompt: z
    .string()
    .min(7, { message: "Prompt must be atleast 7 characters!" }),
});

export default function Page() {
  const [outputImg, setOutputImg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.status === 200) {
        setOutputImg(data.url);
      } else {
        //console.error(data.error);
        toast({ variant: "destructive", description: data.error });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full p-3 min-h-dvh h-full flex justify-start items-center pt-[72px] flex-col">
      <div className="w-full p-3">
        <h1 className="text-center font-bold text-white text-4xl">
          Start Creating
        </h1>
        <p className="text-white/60 text-center">
          Generate stunning image from text for FREE!
        </p>
      </div>
      <div className="flex w-full gap-3 h-[calc(100dvh-200px)] md:flex-row flex-col">
        <div className="__form flex-[2] flex justify-center items-start flex-col gap-2">
          <p className="text-center w-full lg:text-left text-sm text-white/80">
            Type your prompt below to create any image using text for FREE!
          </p>
          <div className="flex w-full gap-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex gap-2"
              >
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-[70%]">
                      <FormControl>
                        <Input
                          placeholder="self driving a car... "
                          className="transition-all border-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button loading={loading} type="submit">
                  Generate
                </Button>
              </form>
            </Form>
          </div>
        </div>
        <div className="__output min-h-[300px] lg:min-h-full lg:h-full flex-[1] bg-white/5 rounded-lg relative overflow-hidden">
          {outputImg ? (
            <Image
              alt="output"
              className="w-full h-full object-contain"
              src={outputImg}
              width={300}
              height={300}
            />
          ) : (
            <>
              <div className="w-full h-full flex justify-center items-center text-white/70 text-center p-3">
                Enter your prompt and hit generate!
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
