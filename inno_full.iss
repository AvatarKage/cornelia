[Setup]
AppId={{584b3a53-fc29-49d4-b5cd-ddf6adffb145}}
AppName=Cornelia
AppVersion=2.0.0
AppPublisher=AvatarKage
AppPublisherURL=https://avatarkage.com
AppCopyright=AvatarKage
DefaultDirName={localappdata}\Cornelia
DefaultGroupName=Cornelia
DisableWelcomePage=no
DisableDirPage=no
DisableProgramGroupPage=no
OutputDir=dist
OutputBaseFilename=Cornelia_2.0.0_Installer
Compression=lzma
SolidCompression=yes
WizardStyle=modern
WizardImageFile=src\studio\assets\images\cornelia_03.png
WizardSmallImageFile=src\studio\assets\images\cornelia_02.png
SetupIconFile=src\icon.ico
PrivilegesRequired=admin
CloseApplications=yes
RestartApplications=no
VersionInfoProductName=Cornelia
VersionInfoVersion=2.0.0
VersionInfoTextVersion=2.0.0-beta
VersionInfoProductVersion=2.0.0
VersionInfoCompany=AvatarKage
VersionInfoDescription=A folder icon automation software.
VersionInfoCopyright=AvatarKage
UsePreviousAppDir=no
UsePreviousGroup=no
UsePreviousTasks=no
UsePreviousUserInfo=no

[Components]
Name: "backend"; Description: "Cornelia"; Types: full compact;
Name: "frontend"; Description: "Cornelia Studio"; Types: full;

[Files]
Source: "build\cornelia\cornelia.exe"; DestDir: "{app}"; Components: backend; Flags: ignoreversion
Source: "src-tauri\target\x86_64-pc-windows-msvc\release\studio.exe"; DestDir: "{app}"; Components: frontend; Flags: ignoreversion
Source: "src\config.toml"; DestDir: "{app}"; Components: backend frontend
Source: "src\icon.ico"; DestDir: "{app}"; Components: frontend backend
Source: "src\userdata\*"; DestDir: "{app}\userdata"; Components: frontend backend; Flags: recursesubdirs createallsubdirs;

[Icons]
Name: "{group}\Cornelia Studio"; Filename: "{app}\studio.exe"; Components: frontend
Name: "{commondesktop}\Cornelia Studio"; Filename: "{app}\studio.exe"; Tasks: desktopicon; Components: frontend

[Tasks]
Name: "desktopicon"; Description: "Create a &desktop shortcut for Cornelia Studio"; GroupDescription: "Additional icons:"; Flags: unchecked

[Run]
Filename: "{app}\cornelia.exe"; Parameters: "--install"; Flags: nowait skipifsilent runhidden; Components: backend
Filename: "{app}\studio.exe"; Components: frontend; Description: "Launch Cornelia Studio"; Flags: nowait postinstall skipifsilent

[UninstallRun]
Filename: "taskkill"; Parameters: "/F /IM cornelia.exe"; Flags: runhidden
Filename: "taskkill"; Parameters: "/F /IM studio.exe"; Flags: runhidden
Filename: "{app}\cornelia.exe"; Parameters: "--uninstall"; Flags: runhidden waituntilterminated

[UninstallDelete]
Type: filesandordirs; Name: "{app}"

[Code]

const
  KOFI_URL = 'https://ko-fi.com/avatarkage';

var
  KoFiButton: TNewButton;

procedure CloseRunningApps();
var
  ResultCode: Integer;
begin
  Exec('taskkill', '/F /IM cornelia.exe', '', SW_HIDE,
    ewWaitUntilTerminated, ResultCode);

  Exec('taskkill', '/F /IM studio.exe', '', SW_HIDE,
    ewWaitUntilTerminated, ResultCode);
end;

procedure OpenKoFi(Sender: TObject);
var
  ResultCode: Integer;
begin
  ShellExec('', KOFI_URL, '', '', SW_SHOWNORMAL, ewNoWait, ResultCode);
end;

procedure InitializeWizard();
begin
  CloseRunningApps();

  KoFiButton := TNewButton.Create(WizardForm);
  KoFiButton.Parent := WizardForm;

  KoFiButton.Caption := '☕ Support me on Ko-fi';
  KoFiButton.Height := WizardForm.NextButton.Height;
  KoFiButton.Width := ScaleX(160);

  KoFiButton.OnClick := @OpenKoFi;
end;

procedure CurPageChanged(CurPageID: Integer);
var
  Message: string;
begin
  if CurPageID = wpFinished then
  begin
    // show button
    KoFiButton.Visible := True;

    // place LEFT of Next/Finish button
    KoFiButton.Top := WizardForm.NextButton.Top;
    KoFiButton.Left := WizardForm.NextButton.Left
                      - KoFiButton.Width
                      - ScaleX(8);

    Message := 'Thank you for installing Cornelia';

    if IsComponentSelected('backend') and IsComponentSelected('frontend') then
    begin
      WizardForm.FinishedLabel.Caption :=
        Message + ' and Cornelia Studio! Cornelia will run in the background and start automatically when your computer starts. You may need to restart your device for it to take effect.';
    end
    else if IsComponentSelected('frontend') and (not IsComponentSelected('backend')) then
    begin
      WizardForm.FinishedLabel.Caption :=
        Message + ' Studio!';
    end
    else if IsComponentSelected('backend') and (not IsComponentSelected('frontend')) then
    begin
      WizardForm.FinishedLabel.Caption :=
        Message + '! It will run in the background and start automatically when your computer starts. You may need to restart your device for it to take effect.';
    end;
  end
  else
  begin
    KoFiButton.Visible := False;
  end;
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