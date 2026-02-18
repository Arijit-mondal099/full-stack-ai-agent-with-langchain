import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

const ChatPage = async () => {
  return (
    <div className="h-full mx-auto max-w-7xl flex flex-col gap-r">
      <div className="flex h-full overflow-y-auto">
        <div className="h-full w-full flex items-center justify-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-500">How can i help you today?</h2>
        </div>
      </div>

      <div className="py-2 bg-white">
        <div className="p-2 border border-gray-200 shadow rounded-lg max-w-5xl w-full mx-auto">
          <Textarea
            name=""
            id=""
            placeholder="Ask me anything..."
            className="border-0 shadow-none focus-visible:ring-0 resize-none"
          ></Textarea>

          <div className="flex items-center justify-between px-4">
            <div>GPT-4.0-mini</div>

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
