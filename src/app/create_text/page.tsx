"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

const formSchema = z.object({
  prompt: z
    .string()
    .min(7, { message: "Prompt must be at least 7 characters!" }),
});

export default function Page() {
  const [outputText, setOutputText] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState<string>("");
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
      setOutputText(null);
      setDisplayText(""); // Clear previous result

      const response = await fetch("/api/text", {
        method: "POST",
        body: JSON.stringify(values),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let streamedText = "";

      while (!done) {
        const { value, done: doneReading } = (await reader?.read()) || {};
        done = doneReading || false;
        streamedText += decoder.decode(value);
        setOutputText(streamedText);
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", description: "An error occurred!" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (outputText) {
      let index = 0;
      const words = outputText.split(" ");
      const interval = setInterval(() => {
        if (index < words.length) {
          setDisplayText((prev) => prev + " " + words[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 10);
      return () => clearInterval(interval);
    }
  }, [outputText]);

  return (
    <div className="w-full p-3 min-h-dvh h-full flex justify-start items-center pt-[72px] flex-col">
      <div className="w-full p-3">
        <h1 className="text-center font-bold text-white text-4xl">
          Start Creating
        </h1>
        <p className="text-white/60 text-center">
          Generate stunning text from AI for FREE!
        </p>
      </div>

      <div className="flex w-full gap-3 h-[calc(100dvh-200px)] md:flex-row flex-col">
        <div className="__form flex-[2] flex justify-center items-start flex-col gap-2">
          <p className="text-center w-full lg:text-left text-sm text-white/80">
            Type your prompt below to generate text using AI for FREE!
          </p>
          <div className="flex w-full gap-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex gap-2">
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

        <div className="__output min-h-[300px] lg:min-h-full lg:h-full flex-[1] bg-white/5 rounded-lg relative  overflow-y-auto max-h-[300px]">
          {displayText ? (
            <div className="w-full h-full flex justify-center items-center text-white/70 text-center p-3">
              <ReactMarkdown>{displayText}</ReactMarkdown>
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center text-white/70 text-center p-3">
              Enter your prompt and hit generate!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
