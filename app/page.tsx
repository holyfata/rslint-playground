import CodeEditor from "@/components/CodeEditor";
import Options from "@/components/Options";
import LintButton from "@/components/LintButton";

export default function Home() {
  return (
    <div className="font-sans w-full h-full flex flex-col">
      <header className="h-20 bg-gray-100 border-b border-gray-200 shrink-0">
        rslint playground
        <LintButton />
      </header>
      <main className="flex-1 grid grid-cols-2">
        <section className="border-r border-gray-200 grid grid-rows-2">
          <section className="border-b border-gray-200">
            <CodeEditor />
          </section>
          <section className="border-t border-gray-200">
            <Options />
          </section>
        </section>
        <section className="border-l border-gray-200">
          MessageBox
        </section>
      </main>
    </div>
  );
}
