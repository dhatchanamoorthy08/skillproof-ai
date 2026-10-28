' =====================================================================
' SkillProof AI - Independent Background Server Runner
' This script runs completely outside Antigravity.
' Closing Antigravity, VS Code, or CMD will NOT stop this server.
' =====================================================================

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

serverDir = "C:\skill proof AI\server"
nodeExe = "C:\Program Files\nodejs\node.exe"

' Check if node is already running on port 5000
Set objExec = WshShell.Exec("cmd /c netstat -aon | findstr "":5000"" | findstr ""LISTENING""")
output = objExec.StdOut.ReadAll()

If InStr(output, "LISTENING") = 0 Then
    WshShell.CurrentDirectory = serverDir
    ' Run completely detached and hidden (0 = hidden window)
    WshShell.Run "cmd /c """ & nodeExe & """ server.js", 0, False
    WScript.Sleep 2500
End If
