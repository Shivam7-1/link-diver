// eslint-disable-next-line spaced-comment
/// <reference types="chrome"/>

import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FetchStatusService } from './fetch-status.service';

/**
 * Packages the URL of a link along with other relevant metadata about that link
 * used throughout the app
 */
export interface LinkData {
  href: string;
  host: string;
  tagName: string;
  hidden: boolean;
  status: string;
}

/**
 * This service is responsible for retreving links from the content script and
 * passing them onto components
 */
@Injectable({
  providedIn: 'root'
})
export class LinkService {

  private linkList: LinkData[] = [];
  linkList$ = new BehaviorSubject<LinkData[]>([]);
  dataLoaded = new EventEmitter();

  addLinks(newLinks: LinkData[]): void {
    for (const str of newLinks) {
      this.linkList.push(str);
    }
    this.linkList$.next(this.linkList);
  }

  constructor() {
    chrome.tabs.getCurrent((tab) => {
      chrome.tabs.sendMessage(tab.openerTabId, {
        message: 'send links'
      }, (links: LinkData[]) => {
        this.addLinks(links);
        this.dataLoaded.emit();
      });
    });
  }
}
