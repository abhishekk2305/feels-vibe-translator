import { useState } from "react";
import TopHeader from "@/components/TopHeader";
import Stories from "@/components/Stories";
import Feed from "@/components/Feed";
import BottomNav from "@/components/BottomNav";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [contentTab, setContentTab] = useState("feed");

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="max-w-sm mx-auto relative">
        <TopHeader />
        
        {/* Content Tabs */}
        <Tabs value={contentTab} onValueChange={setContentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-semi-dark mx-4 mb-4 rounded-lg">
            <TabsTrigger 
              value="feed" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400"
            >
              Feed
            </TabsTrigger>
            <TabsTrigger 
              value="stories" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400"
            >
              Stories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-0">
            <Feed />
          </TabsContent>

          <TabsContent value="stories" className="mt-0">
            <Stories />
            <div className="pb-20"></div>
          </TabsContent>
        </Tabs>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
