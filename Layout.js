import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
    BookOpen, 
    LayoutDashboard, 
    Users, 
    BookMarked, 
    RefreshCw, 
    Bell,
    Search,
    Menu,
    X,
    Settings
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
    {
        title: "Dashboard",
        url: createPageUrl("Dashboard"),
        icon: LayoutDashboard,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50"
    },
    {
        title: "Katalog Buku",
        url: createPageUrl("Catalog"),
        icon: BookOpen,
        color: "text-purple-600", 
        bgColor: "bg-purple-50"
    },
    {
        title: "Manajemen Buku",
        url: createPageUrl("Books"),
        icon: BookMarked,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
    },
    {
        title: "Anggota",
        url: createPageUrl("Members"),
        icon: Users,
        color: "text-green-600",
        bgColor: "bg-green-50"
    },
    {
        title: "Peminjaman",
        url: createPageUrl("Loans"),
        icon: RefreshCw,
        color: "text-orange-600",
        bgColor: "bg-orange-50"
    },
    {
        title: "Notifikasi", 
        url: createPageUrl("Notifications"),
        icon: Bell,
        color: "text-rose-600",
        bgColor: "bg-rose-50"
    }
];

export default function Layout({ children, currentPageName }) {
    const location = useLocation();

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <style>
                    {`
                        :root {
                            --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                            --gradient-accent: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                            --shadow-soft: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                            --shadow-strong: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                        }
                        
                        .glass-effect {
                            background: rgba(255, 255, 255, 0.85);
                            backdrop-filter: blur(20px);
                            border: 1px solid rgba(255, 255, 255, 0.2);
                        }
                        
                        .gradient-text {
                            background: var(--gradient-primary);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            background-clip: text;
                        }
                    `}
                </style>
                
                <Sidebar className="border-r-0 glass-effect">
                    <SidebarHeader className="border-b border-white/20 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <BookOpen className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-xl gradient-text">DigiLib</h2>
                                <p className="text-xs text-slate-600">Perpustakaan Digital Modern</p>
                            </div>
                        </div>
                    </SidebarHeader>

                    <SidebarContent className="p-3">
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                                Menu Utama
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu className="space-y-1">
                                    {navigationItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton 
                                                asChild 
                                                className={`
                                                    group hover:scale-105 transition-all duration-200 rounded-xl p-3
                                                    ${location.pathname === item.url 
                                                        ? `${item.bgColor} ${item.color} shadow-lg border border-white/50` 
                                                        : 'hover:bg-white/60 hover:shadow-md'
                                                    }
                                                `}
                                            >
                                                <Link to={item.url} className="flex items-center gap-3 w-full">
                                                    <div className={`p-2 rounded-lg ${location.pathname === item.url ? 'bg-white/50' : 'bg-slate-100 group-hover:bg-white/70'} transition-colors`}>
                                                        <item.icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-medium">{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    <SidebarFooter className="border-t border-white/20 p-6">
                         <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-100 to-white/50">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">A</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 text-sm truncate">Admin</p>
                                <p className="text-xs text-slate-600 truncate">Perpustakaan Digital</p>
                            </div>
                             <Link to={createPageUrl("Settings")}>
                                <Settings className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" />
                            </Link>
                        </div>
                    </SidebarFooter>
                </Sidebar>

                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* Header dengan mobile trigger */}
                    <header className="glass-effect border-b border-white/20 px-6 py-4 lg:hidden">
                        <div className="flex items-center justify-between">
                            <SidebarTrigger className="hover:bg-white/60 p-2 rounded-lg transition-colors duration-200" />
                            <h1 className="text-xl font-bold gradient-text">DigiLib</h1>
                            <div className="w-8"></div>
                        </div>
                    </header>

                    {/* Main content area */}
                    <div className="flex-1 overflow-auto">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}