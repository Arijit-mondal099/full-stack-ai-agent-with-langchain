"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Loader2 } from "lucide-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useState } from "react";
import {
  AgentPayload,
  AgentResponse,
  Message,
  Provider,
} from "@/lib/agent.types";
import { api } from "@/lib/api";

const ChatPage = () => {
  const models = ["OpenAI", "Gemini", "Llama"];
  const [provider, setProvider] = useState<Provider | string>("OpenAI");
  const [text, setText] = useState<string>("");
  const [loading, setloading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  async function handleRunAgent() {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setloading(true);
    const payload: AgentPayload = {
      provider: provider.toLowerCase(),
      text,
    };
    setText("");

    try {
      const res = await api.post<AgentResponse>("/agent/run", payload);
      const { data, success } = res.data;

      if (success) {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: data.reply, sources: data.sources },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            content: "something went wrong please try again.",
            sources: [],
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  }

  return (
    <div className="h-full mx-auto max-w-7xl flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto h-fit max-w-5xl w-full mx-auto px-4 py-6 space-y-4">
        {messages.length > 0 ? (
          messages.map((msg, idx) =>
            msg.role === "user" ? (
              <div
                key={idx}
                className="ml-auto bg-gray-900 text-white w-fit max-w-3xl px-4 py-2 rounded-2xl shadow"
              >
                {msg.content}
              </div>
            ) : (
              <div
                key={idx}
                className="border border-gray-200 shadow-sm rounded-2xl p-3 text-lg font-medium space-y-6"
              >
                <div className="tracking-tight">{msg.content}</div>

                {msg?.sources && msg.sources.length > 0 && (
                  <div className="border border-gray-200 shadow rounded-2xl p-2 space-y-4">
                    <h2 className="font-semibold">Sources</h2>

                    <div className="flex flex-col gap-2 text-sm font-semibold text-blue-500">
                      {msg.sources.map((link) => (
                        <a href={link} key={link} target="_blank">
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ),
          )
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-500">
              How can I help you today?
            </h2>
          </div>
        )}
      </div>

      <div className="px-2 pb-4 bg-white shrink-0">
        <div className="p-2 border border-gray-200 shadow rounded-2xl max-w-5xl w-full mx-auto">
          <Textarea
            placeholder="Ask me anything..."
            className="border-0 shadow-none focus-visible:ring-0 resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="flex items-center justify-between px-4">
            <Combobox
              items={models}
              value={provider}
              onInputValueChange={(item) => setProvider(item)}
            >
              <ComboboxInput placeholder="Select a framework" />
              <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            <Button onClick={handleRunAgent}>
              {loading ? <Loader2 className="animate-spin" /> : <ArrowUp />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
