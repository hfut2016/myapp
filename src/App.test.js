import React from 'react';

// 引入编辑器以及EditorState子模块
import BraftEditor, { EditorState } from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'

class EditorDemo extends React.Component {
    state = {
        // 创建一个空的editorState作为初始值
        editorState: EditorState.createFrom(''),
        value:null,
    }
    componentDidMount(){
      alert('');
    }
    handleChange = (content) => {
        this.setState({
            editorState: content,
            value: content.toHTML(),
        }) 
    }
   
    handleHTMLChange = () => {
      console.log('2==>',this.state.editorState.toRAW());
      this.state.editorState.toRAW(true).blocks.map(item => console.log(item));
    }
    render () {
        const editorProps = {
            height: 300,
            defaultValue: this.state.editorState,
            onChange: this.handleChange,
            onSave: this.handleHTMLChange
        };
      
        return (
            <div className="demo">
              <BraftEditor {...editorProps}/>
            </div>
        );
    }

}

export default EditorDemo;