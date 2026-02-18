"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const ChatPage = () => {
  const frameworks = ["OpenAI", "Gemini", "Lama"];

  return (
    <div className="h-full mx-auto max-w-7xl flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto h-fit max-w-5xl w-full mx-auto px-4 py-6">
        <div className="h-full w-full flex items-center justify-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-500">How can I help you today?</h2>
        </div>
      </div>

      <div className="px-2 pb-4 bg-white shrink-0">
        <div className="p-2 border border-gray-200 shadow rounded-2xl max-w-5xl w-full mx-auto">
          <Textarea
            placeholder="Ask me anything..."
            className="border-0 shadow-none focus-visible:ring-0 resize-none"
          />

          <div className="flex items-center justify-between px-4">
            <Combobox value={"OpenAI"} items={frameworks}>
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

            <Button>
              <Send />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;