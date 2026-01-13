"use client";

import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  prompt: z.string().min(7, "Prompt must be at least 7 characters"),
});

const TYPE_DELAY = 15; // typing speed (ms per character)

export default function Page() {
  const [displayText, setDisplayText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const { toast } = useToast();

  const abortControllerRef = useRef<AbortController | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [displayText]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  /* ---------------- CURSOR BLINK ---------------- */
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  /* ---------------- STOP GENERATION ---------------- */
  function stopGeneration() {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  }

  /* ---------------- SUBMIT ---------------- */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setDisplayText("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch("/api/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: controller.signal,
      });

      if (response.status === 401) {
        const data = await response.json();

        toast({
          variant: "destructive",
          title: "Unauthorized",
          description:
            data?.error ??
            "You are unauthorized! Login before generating result",
        });

        setIsStreaming(false);
        return;
      }

      // 🔴 HANDLE OTHER ERRORS
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong. Please try again.",
        });
        setIsStreaming(false);
        return;
      }

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";
      let done = false;

      const typeLoop = async () => {
        while (buffer.length > 0) {
          setDisplayText((prev) => prev + buffer[0]);
          buffer = buffer.slice(1);
          await new Promise((r) => setTimeout(r, TYPE_DELAY));
        }
      };

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          buffer += decoder.decode(value, { stream: true });
          await typeLoop();
        }
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      console.error(err);
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Failed to connect to server",
      });
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }

  return (
    <div className="w-full p-4 min-h-dvh flex flex-col gap-6 pt-[72px]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Start Creating</h1>
        <p className="text-white/60">Generate stunning AI text for free</p>
      </div>

      {/* FORM */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-2 justify-center"
        >
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem className="w-full max-w-[500px]">
                <FormControl>
                  <Input {...field} placeholder="Describe the Indian flag..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isStreaming}>
            Generate
          </Button>

          {isStreaming && (
            <Button
              type="button"
              variant="destructive"
              onClick={stopGeneration}
            >
              Stop
            </Button>
          )}
        </form>
      </Form>

      {/* OUTPUT */}
      <div className="flex-1 bg-white/5 rounded-lg p-6 overflow-y-auto">
        {displayText ? (
          <ReactMarkdown
            className="prose prose-invert max-w-none"
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-semibold mt-5 mb-2" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-6 space-y-2" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal pl-6 space-y-2" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-white/90" {...props} />
              ),
            }}
          >
            {displayText + (isStreaming && cursorVisible ? "▋" : "")}
          </ReactMarkdown>
        ) : (
          <p className="text-center text-white/60">
            Enter a prompt and click Generate
          </p>
        )}
        {/* 👇 SCROLL TARGET */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
