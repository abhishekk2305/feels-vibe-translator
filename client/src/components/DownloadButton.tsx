import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  imageUrl?: string;
  text?: string;
  filename?: string;
  className?: string;
}

export default function DownloadButton({ 
  imageUrl, 
  text, 
  filename = "feels-content", 
  className = "" 
}: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    
    try {
      if (imageUrl) {
        // Download image
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else if (text) {
        // Download text file
        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={downloading}
      variant="outline"
      className={`${className} border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300`}
    >
      <Download className="w-4 h-4 mr-2" />
      {downloading ? 'Downloading...' : 'Download'}
    </Button>
  );
}