import { Injectable } from '@angular/core';
import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem';
import { Session } from '../models/session';
import { HistoryService } from './history.service';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(private historyService: HistoryService) {}

  private _session?: Session = undefined;

  public path: string = '';

  get session(): Session | undefined {
    return this._session;
  }

  set session(session: Session | undefined) {
    this._session = session;
    if (session) {
      this.updateSession();
    }
  }

  clearSession() {
    this._session = undefined;
    this.path = '';
  }

  updateSession() {
    this.writeFile(this.path, JSON.stringify(this.session), true);
  }

  async loadFiles(path: string, files: FileInfo[] = []) {
    const result = await Filesystem.readdir({
      path: path,
      directory: Directory.ExternalStorage,
    });
    for (const file of result.files) {
      if (file.type === 'directory') {
        await this.loadFiles(path + '\\' + file.name, files);
      } else if (file.name.endsWith('.subapp')) {
        files.push(file);
      }
    }
    return files;
  }

  async loadDirectory(path: string, files: FileInfo[] = []) {
    const result = await Filesystem.readdir({
      path: path,
      directory: Directory.ExternalStorage,
    });
    for (const file of result.files) {
      if (file.type === 'file' && !file.name.endsWith('.subapp')) {
        break;
      }
      files.push(file);
    }
    return files;
  }

  async writeFile(
    path: string,
    content: string,
    directoryInPath: boolean = false
  ) {
    await Filesystem.writeFile({
      path: path,
      data: btoa(content),
      recursive: true,
      directory: directoryInPath ? undefined : Directory.ExternalStorage,
    })
      .then(() => {})
      .catch(() => {});
  }

  async openFileByFile(file: FileInfo) {
    return await this.openFileByUrl(file.uri);
  }

  async openFileByUrl(url: string, saveInHistory?: boolean): Promise<Session> {
    const result = await Filesystem.readFile({
      path: url,
    });

    let parse: Session;
    if (typeof result.data === 'string') {
      parse = JSON.parse(atob(result.data));
    } else {
      parse = JSON.parse(await result.data.text());
    }
    if (saveInHistory) {
      this.historyService.addHistory(url);
    }
    return parse;
  }

  async deleteFile(file: FileInfo) {
    await Filesystem.deleteFile({
      path: file.uri,
      directory: Directory.ExternalStorage,
    });
  }
}