"use client";
import { Nav } from "@douyinfe/semi-ui";
import Parser from "./Parser";
import TsConfig from "./TsConfig";
import { useState } from "react";

const Options = () => {

    const [activeTab, setActiveTab] = useState('1')
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex flex-row gap-2 h-8 shrink-0">
                <div className="cursor-pointer" onClick={() => setActiveTab('1')}>parser</div>
                <div className="cursor-pointer" onClick={() => {
                    console.log('rule')
                    setActiveTab('2')
                }}>rule</div>
                <div className="cursor-pointer" onClick={() => setActiveTab('3')}>tsconfig</div>
            </div>
            <div className="flex-1">
                {activeTab === '1' && <Parser />}
                {activeTab === '2' && <Parser />}
                {activeTab === '3' && <TsConfig />}
            </div>
        </div>
    )
}

export default Options;