import { makeStyles } from "@mui/styles"

export const modules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],

        //   [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
        //   [{size: ['small', false, 'large', 'huge']}],
        //   ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        //   [{'list': 'ordered'}, {'list': 'bullet'}, 
        //    {'indent': '-1'}, {'indent': '+1'}],
        //   ['link', 'image', 'video'],
        //   ['clean']  
    ],
    // [
    //     [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    //     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    //     [{ 'font': [] }],


    //     [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme

    //     ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    //     ['blockquote', 'code-block'],

    //     [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    //     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    //     [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    //     [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    //     [{ 'direction': 'rtl' }],                         // text direction

    //     [{ 'align': [] }],

    //     ['clean']                                         // remove formatting button
    // ]

}

export const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'color', "background", "code", "script"
]

export const reactQuillStyles = makeStyles({
    quill: {
        borderRadius: 8,
        "& > .ql-toolbar": {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
        },
        "& > .ql-container": {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            height: '130px'
        }
    }
})
export const reactQuillStyles2 = makeStyles({
    quill: {
        width: '87%',
        borderRadius: 8,
        "& > .ql-toolbar ": {
            padding: 2,
            "& > .ql-formats": {
                "& > button": {
                    height: 20
                }
            }
        },
        "& > .ql-toolbar": {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
        },
        "& > .ql-container": {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            height: '50px'
        }
    }
})
