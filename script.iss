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
VersionInfoProductName=Cornelia
VersionInfoVersion=1.0.0
VersionInfoCompany=AvatarKage
VersionInfoDescription=A folder icon automation software.
VersionInfoCopyright=AvatarKage
UsePreviousAppDir=no
UsePreviousGroup=no
UsePreviousTasks=no
UsePreviousUserInfo=no

[Components]
Name: "backend"; Description: "Cornelia (doesn't exist)"; Types: full compact;
Name: "frontend"; Description: "Cornelia Studio"; Types: full;

[Files]
Source: "src-tauri\target\x86_64-pc-windows-msvc\release\Cornelia_Studio.exe"; DestDir: "{app}"; Components: frontend; Flags: ignoreversion
Source: "config\*"; DestDir: "{app}\config"; Flags: recursesubdirs createallsubdirs; Components: frontend backend
Source: "src\common\assets\images\icon.ico"; DestDir: "{app}"; Components: frontend backend

[Icons]
Name: "{group}\Cornelia Studio"; Filename: "{app}\Cornelia_Studio.exe"; Components: frontend

[Run]
Filename: "{app}\Cornelia.exe"; Components: backend; Flags: nowait skipifsilent runhidden
Filename: "{app}\Cornelia_Studio.exe"; Components: frontend; Description: "Launch Cornelia Studio"; Flags: nowait postinstall skipifsilent

[UninstallRun]
Filename: "taskkill"; Parameters: "/F /IM Cornelia.exe"; Flags: runhidden
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
  CloseRunningApps();
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssInstall then
  begin
    CloseRunningApps();
  end;
end;

procedure CurPageChanged(CurPageID: Integer);
var
  Message: string;
begin
  if CurPageID = wpFinished then
  begin
    Message := 'Thank you for installing Cornelia';

    if IsComponentSelected('backend') and IsComponentSelected('frontend') then
    begin
      WizardForm.FinishedLabel.Caption :=
        Message + ' and Cornelia Studio! Cornelia will run in the background and start automatically when your computer starts.';
    end
    else if IsComponentSelected('frontend') and (not IsComponentSelected('backend')) then
    begin
      WizardForm.FinishedLabel.Caption :=
        Message + ' Studio!';
    end
    else if IsComponentSelected('backend') and (not IsComponentSelected('frontend')) then
    begin
      WizardForm.FinishedLabel.Caption :=
        Message + '! It will run in the background and start automatically when your computer starts.';
    end;
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