import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ChatTab } from "./ChatTab";
import { WriteTab } from "./WriteTab";
import { ImagesTab } from "./ImagesTab";
import { CitationsTab } from "./CitationsTab";
import { FormatTab } from "./FormatTab";
import { SettingsTab } from "./SettingsTab";

interface AISidebarProps {
  documentId?: string;
  selectedText?: string;
  onInsertText?: (text: string) => void;
  onInsertImage?: (url: string, alt: string) => void;
}

export function AISidebar({ selectedText, onInsertText, onInsertImage }: AISidebarProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const start = () => setIsProcessing(true);
    const stop = () => setIsProcessing(false);
    window.addEventListener('ai-loading-start', start);
    window.addEventListener('ai-loading-stop', stop);
    return () => {
      window.removeEventListener('ai-loading-start', start);
      window.removeEventListener('ai-loading-stop', stop);
    };
  }, []);

  return (
    <aside className="w-[30%] min-w-[320px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-2xl z-40 flex flex-col h-full overflow-hidden">
      <Tabs defaultValue="chat" className="flex flex-col h-full relative">
        <TabsList className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 p-0 h-auto rounded-none w-full justify-between shrink-0 overflow-x-auto no-scrollbar">
          <TabsTrigger
            value="chat"
            className="flex-1 min-w-[60px] py-3 text-[10px] font-bold uppercase tracking-tight rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="write"
            className="flex-1 min-w-[60px] py-3 text-[10px] font-bold uppercase tracking-tight rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Write
          </TabsTrigger>
          <TabsTrigger
            value="images"
            className="flex-1 min-w-[60px] py-3 text-[10px] font-bold uppercase tracking-tight rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Img
          </TabsTrigger>
          <TabsTrigger
            value="cite"
            className="flex-1 min-w-[60px] py-3 text-[10px] font-bold uppercase tracking-tight rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Cite
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="flex-1 min-w-[60px] py-3 text-[10px] font-bold uppercase tracking-tight rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Set
          </TabsTrigger>
        </TabsList>

        {isProcessing && (
          <div className="absolute top-[41px] left-0 w-full z-50">
            <Progress value={undefined} className="h-0.5 w-full rounded-none bg-transparent" />
          </div>
        )}

        <TabsContent value="chat" className="data-[state=active]:flex-1 data-[state=active]:flex flex-col overflow-hidden m-0">
          <ChatTab selectedText={selectedText} />
        </TabsContent>

        <TabsContent value="write" className="data-[state=active]:flex-1 data-[state=active]:flex flex-col overflow-hidden m-0">
          <WriteTab selectedText={selectedText} onInsertText={onInsertText} />
        </TabsContent>

        <TabsContent value="images" className="data-[state=active]:flex-1 data-[state=active]:flex flex-col overflow-hidden m-0">
          <ImagesTab onInsertImage={onInsertImage} />
        </TabsContent>

        <TabsContent value="cite" className="data-[state=active]:flex-1 data-[state=active]:flex flex-col overflow-hidden m-0">
          <CitationsTab />
        </TabsContent>

        <TabsContent value="settings" className="data-[state=active]:flex-1 data-[state=active]:flex flex-col overflow-hidden m-0">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
