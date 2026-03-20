"use client";
import Link from "next/link";
import { ChevronDown, Share2, FileText, FolderOpen, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavigationBar() {
  const { user, signOut } = useAuth();
  // Allow demo pages to see 'Dashboard/Docs' links for testing
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isDemo = pathname.startsWith('/editor/demo-') || pathname.startsWith('/documents') || pathname.startsWith('/dashboard');
  const showAuthItems = user || isDemo;

  return (
    <nav className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-50 shrink-0">
      <div className="flex items-center space-x-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-xl">W</span>
          </div>
          <span className="font-bold text-gray-800 dark:text-gray-100 text-lg tracking-tight">
            WordAI Studio
          </span>
        </Link>
        
        {showAuthItems && (
          <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-gray-700 pl-4 hidden md:flex">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="font-bold text-blue-600 hover:bg-blue-50">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/editor/new">
              <Button variant="ghost" size="sm" className="font-medium text-gray-600 dark:text-gray-300">
                <FileText className="w-4 h-4 mr-2" />
                New Doc
              </Button>
            </Link>
            <Link href="/documents">
              <Button variant="ghost" size="sm" className="font-medium text-gray-600 dark:text-gray-300">
                <FolderOpen className="w-4 h-4 mr-2" />
                My Documents
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        {showAuthItems ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="font-medium dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                  Export <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-xl p-1">
                <DropdownMenuItem className="cursor-pointer" onClick={async () => {
                  const { exportToPdf } = await import('@/lib/exportService');
                  const title = document.querySelector('h1')?.innerText || 'Assignment';
                  const text = (document.querySelector('.ProseMirror') as HTMLElement)?.innerText || '';
                  const pdfBuffer = await exportToPdf(title, text);
                  const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${title}.pdf`;
                  link.click();
                }}>
                  PDF Document (.pdf)
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={async () => {
                   const { exportToDocx } = await import('@/lib/exportService');
                   const title = document.querySelector('h1')?.innerText || 'Assignment';
                   const text = (document.querySelector('.ProseMirror') as HTMLElement)?.innerText || '';
                   const docxBuffer = await exportToDocx(title, text);
                   const blob = new Blob([docxBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                   const url = URL.createObjectURL(blob);
                   const link = document.createElement('a');
                   link.href = url;
                   link.download = `${title}.docx`;
                   link.click();
                }}>
                  Word Document (.docx)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => {
                   const title = document.querySelector('h1')?.innerText || 'Assignment';
                   const text = (document.querySelector('.ProseMirror') as HTMLElement)?.innerText || '';
                   const content = `${title}\n${'='.repeat(title.length)}\n\n${text}`;
                   const blob = new Blob([content], { type: 'text/plain' });
                   const url = URL.createObjectURL(blob);
                   const link = document.createElement('a');
                   link.href = url;
                   link.download = `${title}.txt`;
                   link.click();
                }}>
                  Plain Text (.txt)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'WordAI Studio Document',
                    text: 'Check out my assignment in WordAI Studio!',
                    url: window.location.href,
                  }).catch(console.error);
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Share link copied to clipboard!');
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white dark:border-gray-700 shadow-sm flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-105 transition-transform uppercase">
                  {user?.email?.[0] || 'D'}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user ? 'Account' : 'Demo Account'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email || 'demo@wordai.studio'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                {user ? (
                   <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={() => signOut()}>
                     <LogOut className="mr-2 h-4 w-4" />
                     <span>Log out</span>
                   </DropdownMenuItem>
                ) : (
                  <Link href="/login">
                    <DropdownMenuItem className="cursor-pointer text-blue-600 focus:text-blue-600">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Sign In</span>
                    </DropdownMenuItem>
                  </Link>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg px-4">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
