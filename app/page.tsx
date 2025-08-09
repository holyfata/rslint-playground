import CodeEditor from "@/components/CodeEditor";

export default function Home() {
  return (
    <div className="font-sans">
      <header className="h-20 bg-gray-100 border-b border-gray-200">rslint playground</header>
      <main>
        <section>
          <section>
            <CodeEditor />
          </section>
          <section>
            Options
          </section>
        </section>
        <section>
          MessageBox
        </section>
      </main>
    </div>
  );
}
