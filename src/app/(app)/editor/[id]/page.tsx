"use client";

import { useState } from "react";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { AISidebar } from "@/components/sidebar/AISidebar";

export default function EditorPage({ params }: { params: { id: string } }) {
  const [selectedText, setSelectedText] = useState('');

  return (
    <>
      <EditorPanel
        documentId={params.id}
        onSelectionChange={setSelectedText}
      />
      <AISidebar
        documentId={params.id}
        selectedText={selectedText}
      />
    </>
  );
}
