import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import HanziWriter from 'hanzi-writer';


interface QuestionHanziProps {
    character: string;
    onContinue: () => void;
}

export function QuestionHanzi({ character, onContinue }: QuestionHanziProps) {
    const hanziWriterRef = useRef<HanziWriter | null>(null);
    const characterContainerRef = useRef<HTMLDivElement>(null);
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;

        if (characterContainerRef.current) {
            hanziWriterRef.current = HanziWriter.create(characterContainerRef.current, character, {
                width: 200,
                height: 200,
                padding: 0,
                showOutline: true,
                strokeColor: '#3b82f6',
                radicalColor: '#ef4444',

            });
            if (hanziWriterRef.current) {
                hanziWriterRef.current.animateCharacter();
            }
        }

        return () => {
            isMounted.current = false;
            if (hanziWriterRef.current) {
                (hanziWriterRef.current as any).cancelDrawing();
                (hanziWriterRef.current as any).destroy();
            }
        };
    }, [character]);

    return (
        <div className="flex flex-col items-center justify-between w-full h-full gap-4">
            <div className="flex items-center justify-center p-4 md:p-12 rounded-md border-2 border-neutral-700 relative">
                <div ref={characterContainerRef} className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] relative">
                    <div
                        className="absolute top-1/2 left-0 w-full border-b border-dashed border-neutral-400"
                        style={{ transform: 'translateY(-50%)' }}
                    />
                </div>
            </div>
            <Button className="w-full" onClick={onContinue}>Continue</Button>
        </div>
    );
};