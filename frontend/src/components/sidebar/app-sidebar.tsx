import * as React from 'react';
// import { Command } from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import DirectMessage from '../chat/DirectMessage';
import GroupMessageList from '../chat/GroupChatList';
import { NavUser } from './nav-user';
import { useStoreUser } from '@/store/useStoreUser';
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const {user} = useStoreUser();
    if(!user) return null;
    return (
        <Sidebar variant="inset" {...props} className='border border-gray-200 rounded-xl shadow-xl'>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild></SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {/* Direct Messsage */}
                <SidebarGroup>
                    <SidebarGroupLabel className="uppercase">bạn bè</SidebarGroupLabel>
                    <SidebarGroupAction title="Kết Bạn" className="cursor-pointer">
                        {/* <AddFriendModal /> */}
                    </SidebarGroupAction>

                    <SidebarGroupContent>
                        <DirectMessage />
                    </SidebarGroupContent>
                </SidebarGroup>
                {/* Group Message */}
                <SidebarGroup>
                    <SidebarGroupLabel className="uppercase">nhóm chat</SidebarGroupLabel>
                    <SidebarGroupAction title="Thêm nhóm" className="cursor-pointer"></SidebarGroupAction>
                    <SidebarGroupContent>
                        <GroupMessageList />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter><NavUser key={user?._id} user={user} /></SidebarFooter>
        </Sidebar>
    );
}
