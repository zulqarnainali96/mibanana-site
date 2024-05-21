import { Box } from '@mui/material'
import { fontsFamily } from 'assets/font-family'
import { mibananaColor } from 'assets/new-images/colors'
import MDBox from 'components/MDBox'
import React from 'react'

const ChatList = (props) => {
    const { chats, _is500, index, userId } = props
    return (
        <>
            {_is500 ? (
                <prev key={index}
                    className={`message ${chats.user === userId ? "right" : "left"
                        }`}
                    style={{ position: "relative" }}>
                    <MDBox display="flex" gap="12px">
                        <p style={{ ...nameStyle, position: "relative", width: "100%", fontSize: "11px" }}>
                            {chats.name}
                            <span
                                style={{ ...nameStyle, fontWeight: "300", fontSize: "9px" }}
                            >
                                {" (" + chats?.role + ")"}
                            </span>
                            <span
                                style={{
                                    fontSize: "8px",
                                    fontWeight: "300",
                                    position: "absolute",
                                    right: "10px",
                                    color: mibananaColor.tableHeaderColor,
                                }}
                            >
                                {chats.time_data ? chats.time_data : null}
                            </span>
                        </p>
                    </MDBox>
                    <Box
                        sx={{ mt: 1, p: '7px', paddingInline: _is500 && '18px', ...nameStyle, fontWeight: "300", fontSize: "10px" }}
                        className="message-content"
                        dangerouslySetInnerHTML={{ __html: chats.message }}
                    >

                    </Box>
                </prev>
            ) : (
                <pre
                    key={index}
                    className={`message ${chats.user === userId ? "right" : "left"
                        }`}
                    style={{ position: "relative" }}
                >
                    <Box sx={{ display: "flex" }}>
                        <img
                            src={chats.avatar}
                            width={50}
                            height={50}
                            loading="lazy"
                            style={{
                                borderRadius: 0,
                                marginTop: -7,
                                display: "inline-block",
                                left: chats.user === userId ? "70px" : "-9px",
                            }}
                        />
                        <Box width="100%" ml={"18px"}>
                            <Box
                                className="user-name"
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                    alignItems: "center",
                                }}
                            >
                                <p style={{ ...nameStyle, position: "relative", width: "100%" }}>
                                    {chats.name}
                                    <span
                                        style={{ ...nameStyle, fontWeight: "300", fontSize: "12px" }}
                                    >
                                        {" (" + chats?.role + ")"}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "10px",
                                            fontWeight: "300",
                                            position: "absolute",
                                            right: "10px",
                                            color: mibananaColor.tableHeaderColor,
                                        }}
                                    >
                                        {chats.time_data ? chats.time_data : null}
                                    </span>
                                </p>
                            </Box>
                            <Box
                                sx={{ p: 2, ...nameStyle, fontWeight: "300", fontSize: "12px" }}
                                className="message-content"
                                dangerouslySetInnerHTML={{ __html: chats.message }}
                            >

                            </Box>
                        </Box>
                    </Box>
                </pre>)}
        </>
    )
}

const nameStyle = {
    fontFamily: fontsFamily.poppins,
    fontWeight: "600",
    fontSize: "16px",
    color: mibananaColor.yellowTextColor,
};

export default ChatList
