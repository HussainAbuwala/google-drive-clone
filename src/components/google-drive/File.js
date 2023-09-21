import { faFile } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

export default function File({ file }) {
  return (
    <a
      href={file.url}
      target="_blank"
      className="btn btn-outline-dark text-truncate w-100" rel="noreferrer"
    >
      <FontAwesomeIcon icon={faFile}/>
      <span className="ms-1">{file.name}</span>
    </a>
  )
}