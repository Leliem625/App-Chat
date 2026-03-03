import { Smile } from 'lucide-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface EmojiPickerProps {
    onChange: (value: string) => void;
}

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
    return (
        <Popover>
            <PopoverTrigger className="cursor-pointer">
                <Smile className="size-4" />
            </PopoverTrigger>

            <PopoverContent
                side="right"
                sideOffset={40}
                className="bg-tranparent border-none shadow-none drop-shadow-none mb-12"
            >
                <Picker
                    data={data}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onEmojiSelect={(emoji: any) => onChange(emoji.native)}
                    emojiSize={24}
                />
            </PopoverContent>
        </Popover>
    );
};

export default EmojiPicker;
