import { Grid } from '@mui/material'
import React, { useEffect } from 'react'

const ProjectFilesFolder = (props) => {

    const { selectedFilePeople, handleFilePeopleChange, activebtn, currentVersion, getListThroughVersion,
        fileVersion, role, addFileVerion, addVersionStyle, versionHandler, project, getFullFolderArray, checkVersionEmpty } = props

    useEffect(() => {
        // console.log(selectedFilePeople)
    }, [selectedFilePeople])

    return (
        <Grid>
            <>
                {/* <button
                className={`uploadbtn ${activebtn == "files" && "activeClass"}`}
                onClick={() => {
                  setActiveBtn("files");
                //   getAllfiles();
                }}
              >
                Files
              </button> */}
                <select
                    value={selectedFilePeople}
                    onChange={handleFilePeopleChange}
                    className={`selectType1 ${activebtn == "folder" && "activeClass"}`}
                    style={{ textTransform: 'capitalize' }}
                >
                    <option value="">Folders</option>
                    {getFullFolderArray().map((item, i) => (
                        <option key={i} value={item} disabled={checkVersionEmpty(item)} >{i === 0 || i === 1 || i === 2 ? item : `version ${item}`}</option>
                    ))
                    }
                </select>
                {/* <select
                value={selectedFileType}
                onChange={handleFileTypeChange}
                className={`selectType1 ${activebtn == "type" && "activeClass"}`}
              >
                <option value="">Type</option>
                <option value="svg">SVG</option>
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="pdf">PDF</option>
              </select> */}
                {/* <select
                    className="selectType1"
                    value={currentVersion}
                    onChange={getListThroughVersion}
                >
                    <option value="">Not Selected</option>
                    {fileVersion?.length > 0 ? (
                        fileVersion.map((item) => (
                            <>
                                <option value={item}>{`version ${item}`}</option>
                            </>
                        ))
                    ) : (
                        <>
                            <option value="">no options</option>
                        </>
                    )}
                </select> */}
                {role?.projectManager || role?.designer || role?.admin ? (
                    <button
                        className="selectType1 addnewversion"
                        onClick={addFileVerion}
                        style={addVersionStyle}
                    >
                        Add new version
                    </button>
                ) : null}
                {role?.projectManager || role?.designer || role?.admin ? (
                    <button className="selectType1 addnewversion" onClick={versionHandler} style={addVersionStyle}>
                        Delete version
                    </button>
                ) : null}
            </>
        </Grid>
    )
}

export default ProjectFilesFolder
