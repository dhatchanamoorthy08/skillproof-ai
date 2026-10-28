Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get project server directory
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
serverDir = scriptDir & "\server"

' Launch server completely hidden in the background (0 = hide window)
WshShell.CurrentDirectory = serverDir
WshShell.Run "cmd /c node server.js", 0, False

' Give server 2 seconds to initialize, then launch the landing page in browser
WScript.Sleep 2000
WshShell.Run "http://localhost:5000"
