import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PinyinEngine from 'pinyin-engine';
import { hanziCharacters } from './hanzi-data';

interface HanziKeyboardProps {
    onCharacterSelect: (character: string) => void;
    value: string;
}

export function HanziKeyboard({ onCharacterSelect, value }: HanziKeyboardProps) {
    const [pinyinInput, setPinyinInput] = useState('');
    const [showKeyboard, setShowKeyboard] = useState(false);
    const keyboardRef = useRef<HTMLDivElement>(null);
    const [pinyinResults, setPinyinResults] = useState<string[]>([]);
    const [maxResults, setMaxResults] = useState(5);

    const handlePinyinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const pinyin = e.target.value;
        setPinyinInput(pinyin);
        const engine = new PinyinEngine(hanziCharacters);
        const results = engine.query(pinyin);
        setPinyinResults(results.slice(0, maxResults));
        if (results.length > 0) {
            onCharacterSelect(results[0]);
        }
    };

    // Close keyboard when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (keyboardRef.current && !keyboardRef.current.contains(event.target as Node)) {
                setShowKeyboard(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [keyboardRef]);


    return (
        <div className="inline-flex items-center gap-2 relative">
            <Input
                value={value}
                onChange={(e) => onCharacterSelect(e.target.value)}
                onClick={() => setShowKeyboard(true)}
                className="w-32 bg-slate-900 text-lg caret-blue-400 text-slate-200"
                placeholder="输入汉字..."
            />
            <Button
                variant="outline"
                onClick={() => setShowKeyboard(!showKeyboard)}
                className="bg-slate-800 hover:bg-slate-700 h-10 px-4"
            >
                拼音
            </Button>

            {showKeyboard && (
                <div ref={keyboardRef} className="absolute z-50 mt-2 p-4 bg-slate-800 rounded-lg shadow-lg border border-slate-700"
                    style={{ top: '100%', left: '0' }}>
                    <div className="flex flex-col gap-4">
                        <Input
                            value={pinyinInput}
                            onChange={handlePinyinInput}
                            placeholder="Type pinyin here..."
                            className="w-full bg-slate-900 text-slate-200"
                        />
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setMaxResults(5)}
                                className={`bg-slate-800 hover:bg-slate-700 h-8 px-2 text-sm ${maxResults === 5 ? 'bg-slate-700 text-slate-200' : ''}`}
                            >
                                5
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setMaxResults(10)}
                                className={`bg-slate-800 hover:bg-slate-700 h-8 px-2 text-sm ${maxResults === 10 ? 'bg-slate-700 text-slate-200' : ''}`}
                            >
                                10
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setMaxResults(20)}
                                className={`bg-slate-800 hover:bg-slate-700 h-8 px-2 text-sm ${maxResults === 20 ? 'bg-slate-700 text-slate-200' : ''}`}
                            >
                                20
                            </Button>
                        </div>

                        <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto">
                            {pinyinResults.map((hanzi, index) => (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    onClick={() => {
                                        onCharacterSelect(hanzi);
                                        setPinyinInput('');
                                        setShowKeyboard(false);
                                    }}
                                    className="h-10 w-10 text-lg hover:bg-slate-700 text-slate-200"
                                >
                                    {hanzi}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
