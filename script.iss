[Setup]
AppId={{584b3a53-fc29-49d4-b5cd-ddf6adffb145}}
AppName=Cornelia
AppVersion=2.0.0
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
Source: "build\Cornelia.exe"; DestDir: "{app}"; Components: backend; Flags: ignoreversion
Source: "src-tauri\target\x86_64-pc-windows-msvc\release\Cornelia_Studio.exe"; DestDir: "{app}"; Components: frontend; Flags: ignoreversion
Source: "config\*"; DestDir: "{app}\config"; Flags: recursesubdirs createallsubdirs; Components: backend
Source: "src\common\assets\images\icon.ico"; DestDir: "{app}"; Components: frontend backend
Source: "src\common\assets\images\icon.ico"; DestDir: "{app}\src\common\assets\images"; Components: frontend backend
Source: "src\common\assets\*"; DestDir: "{app}\src\common\assets"; Components: backend

[Icons]
Name: "{group}\Cornelia Studio"; Filename: "{app}\Cornelia_Studio.exe"; Components: frontend

[Run]
Filename: "{app}\Cornelia.exe"; Parameters: "--install"; Flags: runhidden waituntilterminated; Components: backend
Filename: "{app}\Cornelia.exe"; Components: backend; Flags: nowait skipifsilent runhidden
Filename: "{app}\Cornelia_Studio.exe"; Components: frontend; Description: "Launch Cornelia Studio"; Flags: nowait postinstall skipifsilent

[UninstallRun]
Filename: "taskkill"; Parameters: "/F /IM Cornelia.exe"; Flags: runhidden
Filename: "taskkill"; Parameters: "/F /IM Cornelia_Studio.exe"; Flags: runhidden
Filename: "{app}\Cornelia.exe"; Parameters: "--uninstall"; Flags: runhidden waituntilterminated

[Code]

const
  KOFI_URL = 'https://ko-fi.com/avatarkage';

var
  KoFiButton: TNewButton;

procedure CloseRunningApps();
var
  ResultCode: Integer;
begin
  Exec('taskkill', '/F /IM Cornelia.exe', '', SW_HIDE,
    ewWaitUntilTerminated, ResultCode);

  Exec('taskkill', '/F /IM Cornelia_Studio.exe', '', SW_HIDE,
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