import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder';
import { FaBold, FaItalic, FaStrikethrough, FaCode } from "react-icons/fa6";
import { FaListOl, FaListUl } from "react-icons/fa";
import { BiCodeBlock } from "react-icons/bi";
import { IoArrowUndo, IoArrowRedo } from "react-icons/io5";


const MenuBar = () => {
    const { editor } = useCurrentEditor()

    if (!editor) {
        return null
    }

    return (
        <div>
            <div className="flex gap-2 p-1 mt-2 border-2 border-secondary-300 rounded-t-[5px]">
                <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleBold()
                            .run()
                    }
                    className={`editor_button ${editor.isActive('bold') ? 'is-active' : ''}`}
                >
                    <FaBold />
                </button>

                <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`editor_button ${editor.isActive('italic') ? 'is-active' : ''}`}
                >
                    <FaItalic />
                </button>

                <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={`editor_button ${editor.isActive('strike') ? 'is-active' : ''}`}
                >
                    <FaStrikethrough />
                </button>

                <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={!editor.can().chain().focus().toggleCode().run()}
                    className={`editor_button ${editor.isActive('code') ? 'is-active' : ''}`}
                >
                    <FaCode />
                </button>

                <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`editor_button ${editor.isActive('bulletList') ? 'is-active' : ''}`}
                >
                    <FaListUl />
                </button>

                <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`editor_button ${editor.isActive('orderedList') ? 'is-active' : ''}`}
                >
                    <FaListOl />
                </button>

                <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`editor_button ${editor.isActive('codeBlock') ? 'is-active' : ''}`}
                >
                    <BiCodeBlock />
                </button>

                <button
                    type='button'
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="editor_button"
                >
                    <IoArrowUndo />
                </button>

                <button
                    type='button'
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="editor_button"
                >
                    <IoArrowRedo />
                </button>
            </div>
        </div>
    )
}

const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
        },
    }),
    Placeholder.configure({
        placeholder: 'Content',
    }),
]

export default function TipTapEditor() {
    return (
        <EditorProvider slotBefore={<MenuBar />} extensions={extensions} content={null}></EditorProvider>
    )
}