//
//  CultureInfo.m
//  Gira_iOS
//
//  Created by Øyvind Habberstad on 30/08/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "CultureInfo.h"

@implementation CultureInfo

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getCultureInfo:(RCTResponseSenderBlock)callback){
  NSString *locale = [[NSLocale currentLocale] localeIdentifier];
  callback(@[locale]);
}

@end
