[Setup]
AppId={{584b3a53-fc29-49d4-b5cd-ddf6adffb145}}
AppName=Cornelia
AppVersion=1.0.0
AppPublisher=AvatarKage
AppPublisherURL=https://avatarkage.com
AppCopyright=AvatarKage
DefaultDirName={pf}\Cornelia
DefaultGroupName=Cornelia
DisableWelcomePage=no
DisableDirPage=no
DisableProgramGroupPage=no
OutputDir=release
OutputBaseFilename=Cornelia_Installer
Compression=lzma
SolidCompression=yes
WizardStyle=modern
WizardImageFile=src\common\assets\images\cornelia_03.png
WizardSmallImageFile=src\common\assets\images\cornelia_02.png
SetupIconFile=src\common\assets\images\icon.ico
PrivilegesRequired=admin
CloseApplications=yes
RestartApplications=no
VersionInfoCompany=AppPublisher
VersionInfoCopyright=AppCopyright
VersionInfoProductName=AppName

[Components]
Name: "backend"; Description: "Cornelia (doesn't exist yet)"; Types: full compact;
Name: "frontend"; Description: "Cornelia Studio"; Types: full;

[Icons]
Name: "{group}\Cornelia Studio"; Filename: "{app}\Cornelia_Studio.exe"; Components: frontend

[Files]
Source: "src-tauri\target\x86_64-pc-windows-msvc\release\Cornelia_Studio.exe"; DestDir: "{app}"; Flags: ignoreversion; Components: frontend
Source: "config\*"; DestDir: "{app}\config"; Flags: recursesubdirs createallsubdirs; Components: frontend
Source: "src\common\assets\images\icon.ico"; DestDir: "{app}"; Components: frontend

[UninstallRun]
Filename: "taskkill"; Parameters: "/F /IM Cornelia_Studio.exe"; Flags: runhidden

[Code]

procedure CloseRunningApps();
var
  ResultCode: Integer;
begin
  Exec('taskkill', '/F /IM Cornelia.exe', '', SW_HIDE,
    ewWaitUntilTerminated, ResultCode);
  Exec('taskkill', '/F /IM Cornelia_Studio.exe', '', SW_HIDE,
    ewWaitUntilTerminated, ResultCode);
end;

procedure InitializeWizard();
begin
  // Close app BEFORE installation starts
  CloseRunningApps();
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssInstall then
  begin
    CloseRunningApps();
  end;
end;

function NextButtonClick(CurPageID: Integer): Boolean;
var
  BackendSelected, FrontendSelected: Boolean;
begin
  Result := True;

  if CurPageID = wpSelectComponents then
  begin
    BackendSelected := IsComponentSelected('backend');
    FrontendSelected := IsComponentSelected('frontend');

    if (not BackendSelected) and (not FrontendSelected) then
    begin
      MsgBox(
        'You must select at least one option to install.',
        mbError, MB_OK
      );
      Result := False;
    end;
  end;
end;