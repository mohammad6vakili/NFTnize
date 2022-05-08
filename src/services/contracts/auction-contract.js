// Automatically generated with Reach 0.1.7 (c1c4a449)
/* eslint-disable */
export const _version = '0.1.7';
export const _versionHash = '0.1.7 (c1c4a449)';
export const _backendVersion = 7;

export function getExports(s) {
  const stdlib = s.reachStdlib;
  return {
    };
  };
export function _getEvents(s) {
  const stdlib = s.reachStdlib;
  return {
    };
  };
export function _getViews(s, viewlib) {
  const stdlib = s.reachStdlib;
  const ctc0 = stdlib.T_Address;
  const ctc1 = stdlib.T_Token;
  const ctc2 = stdlib.T_UInt;
  
  return {
    infos: {
      Auction: {
        currentPrice: {
          decode: async (i, svs, args) => {
            if (stdlib.eq(i, stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 1))) {
              const [v226, v227, v228, v229, v230, v232] = svs;
              stdlib.assert(false, 'illegal view')
              }
            if (stdlib.eq(i, stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 5))) {
              const [v226, v227, v229, v244, v245, v246, v248, v252, v255, v256] = svs;
              return (await ((async () => {
                
                
                return v244;}))(...args));
              }
            
            stdlib.assert(false, 'illegal view')
            },
          ty: ctc2
          },
        endSecs: {
          decode: async (i, svs, args) => {
            if (stdlib.eq(i, stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 1))) {
              const [v226, v227, v228, v229, v230, v232] = svs;
              stdlib.assert(false, 'illegal view')
              }
            if (stdlib.eq(i, stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 5))) {
              const [v226, v227, v229, v244, v245, v246, v248, v252, v255, v256] = svs;
              return (await ((async () => {
                
                
                return v245;}))(...args));
              }
            
            stdlib.assert(false, 'illegal view')
            },
          ty: ctc2
          },
        highestBidder: {
          decode: async (i, svs, args) => {
            if (stdlib.eq(i, stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 1))) {
              const [v226, v227, v228, v229, v230, v232] = svs;
              stdlib.assert(false, 'illegal view')
              }
            if (stdlib.eq(i, stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 5))) {
              const [v226, v227, v229, v244, v245, v246, v248, v252, v255, v256] = svs;
              return (await ((async () => {
                
                
                return v246;}))(...args));
              }
            
            stdlib.assert(false, 'illegal view')
            },
          ty: ctc0
          },
        token: {
          decode: async (i, svs, args) => {
            if (stdlib.eq(i, stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 1))) {
              const [v226, v227, v228, v229, v230, v232] = svs;
              stdlib.assert(false, 'illegal view')
              }
            if (stdlib.eq(i, stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 5))) {
              const [v226, v227, v229, v244, v245, v246, v248, v252, v255, v256] = svs;
              return (await ((async () => {
                
                
                return v227;}))(...args));
              }
            
            stdlib.assert(false, 'illegal view')
            },
          ty: ctc1
          }
        }
      },
    views: {
      1: [ctc0, ctc1, ctc2, ctc2, ctc2, ctc2],
      5: [ctc0, ctc1, ctc2, ctc2, ctc2, ctc0, ctc2, ctc2, ctc2, ctc2]
      }
    };
  
  };
export function _getMaps(s) {
  const stdlib = s.reachStdlib;
  const ctc0 = stdlib.T_Tuple([]);
  return {
    mapDataTy: ctc0
    };
  };
export async function Auctioneer(ctcTop, interact) {
  if (typeof(ctcTop) !== 'object' || ctcTop._initialize === undefined) {
    return Promise.reject(new Error(`The backend for Auctioneer expects to receive a contract as its first argument.`));}
  if (typeof(interact) !== 'object') {
    return Promise.reject(new Error(`The backend for Auctioneer expects to receive an interact object as its second argument.`));}
  const ctc = ctcTop._initialize();
  const stdlib = ctc.stdlib;
  const ctc0 = stdlib.T_UInt;
  const ctc1 = stdlib.T_Token;
  const ctc2 = stdlib.T_Object({
    reservedPrice: ctc0,
    startingBid: ctc0,
    timeout: ctc0,
    token: ctc1
    });
  const ctc3 = stdlib.T_Null;
  const ctc4 = stdlib.T_Tuple([ctc0]);
  const ctc5 = stdlib.T_Data({
    Bidder_close0_61: ctc4,
    Bidder_getBid0_61: ctc4
    });
  const ctc6 = stdlib.T_Address;
  
  
  const v221 = stdlib.protect(ctc2, await interact.getSale(), {
    at: './auction.rsh:51:36:application',
    fs: ['at ./auction.rsh:45:18:application call to [unknown function] (defined at: ./auction.rsh:45:22:function exp)'],
    msg: 'getSale',
    who: 'Auctioneer'
    });
  const v222 = v221.token;
  const v223 = v221.startingBid;
  const v224 = v221.reservedPrice;
  const v225 = v221.timeout;
  
  const txn1 = await (ctc.sendrecv({
    args: [v222, v223, v224, v225],
    evt_cnt: 4,
    funcNum: 0,
    lct: stdlib.checkedBigNumberify('./auction.rsh:54:6:dot', stdlib.UInt_max, 0),
    onlyIf: true,
    out_tys: [ctc1, ctc0, ctc0, ctc0],
    pay: [stdlib.checkedBigNumberify('./auction.rsh:54:6:decimal', stdlib.UInt_max, 0), []],
    sim_p: (async (txn1) => {
      const sim_r = { txns: [], mapRefs: [], maps: [] };
      
      const {data: [v227, v228, v229, v230], secs: v232, time: v231, didSend: v35, from: v226 } = txn1;
      
      sim_r.txns.push({
        amt: stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 0),
        kind: 'init',
        tok: v227
        });
      sim_r.txns.push({
        amt: stdlib.checkedBigNumberify('./auction.rsh:54:6:decimal', stdlib.UInt_max, 0),
        kind: 'to',
        tok: undefined
        });
      sim_r.isHalt = false;
      
      return sim_r;
      }),
    soloSend: true,
    timeoutAt: undefined,
    tys: [ctc1, ctc0, ctc0, ctc0],
    waitIfNotPresent: false
    }));
  const {data: [v227, v228, v229, v230], secs: v232, time: v231, didSend: v35, from: v226 } = txn1;
  ;
  ;
  const txn2 = await (ctc.sendrecv({
    args: [v226, v227, v228, v229, v230, v232],
    evt_cnt: 0,
    funcNum: 1,
    lct: v231,
    onlyIf: true,
    out_tys: [],
    pay: [stdlib.checkedBigNumberify('./auction.rsh:62:6:dot', stdlib.UInt_max, 0), [[stdlib.checkedBigNumberify('./auction.rsh:59:15:decimal', stdlib.UInt_max, 1), v227]]],
    sim_p: (async (txn2) => {
      const sim_r = { txns: [], mapRefs: [], maps: [] };
      
      const {data: [], secs: v236, time: v235, didSend: v43, from: v234 } = txn2;
      
      sim_r.txns.push({
        amt: stdlib.checkedBigNumberify('./auction.rsh:62:6:dot', stdlib.UInt_max, 0),
        kind: 'to',
        tok: undefined
        });
      sim_r.txns.push({
        amt: stdlib.checkedBigNumberify('./auction.rsh:59:15:decimal', stdlib.UInt_max, 1),
        kind: 'to',
        tok: v227
        });
      const v240 = stdlib.addressEq(v226, v234);
      stdlib.assert(v240, {
        at: './auction.rsh:62:6:dot',
        fs: [],
        msg: 'sender correct',
        who: 'Auctioneer'
        });
      
      const v243 = stdlib.add(v232, v230);
      const v244 = v228;
      const v245 = v243;
      const v246 = v226;
      const v247 = true;
      const v248 = stdlib.checkedBigNumberify('./auction.rsh:84:21:decimal', stdlib.UInt_max, 0);
      const v249 = v235;
      const v252 = v236;
      const v255 = stdlib.checkedBigNumberify('./auction.rsh:39:11:after expr stmt semicolon', stdlib.UInt_max, 0);
      const v256 = stdlib.checkedBigNumberify('./auction.rsh:59:15:decimal', stdlib.UInt_max, 1);
      
      if (await (async () => {
        
        return v247;})()) {
        sim_r.isHalt = false;
        }
      else {
        const v360 = stdlib.lt(v255, v229);
        if (v360) {
          sim_r.txns.push({
            amt: v255,
            kind: 'from',
            to: v246,
            tok: undefined
            });
          sim_r.txns.push({
            amt: v256,
            kind: 'from',
            to: v226,
            tok: v227
            });
          sim_r.txns.push({
            kind: 'halt',
            tok: v227
            })
          sim_r.txns.push({
            kind: 'halt',
            tok: undefined
            })
          sim_r.isHalt = true;
          }
        else {
          sim_r.txns.push({
            amt: v255,
            kind: 'from',
            to: v226,
            tok: undefined
            });
          sim_r.txns.push({
            amt: v256,
            kind: 'from',
            to: v246,
            tok: v227
            });
          sim_r.txns.push({
            kind: 'halt',
            tok: v227
            })
          sim_r.txns.push({
            kind: 'halt',
            tok: undefined
            })
          sim_r.isHalt = true;
          }}
      return sim_r;
      }),
    soloSend: true,
    timeoutAt: undefined,
    tys: [ctc6, ctc1, ctc0, ctc0, ctc0, ctc0],
    waitIfNotPresent: false
    }));
  const {data: [], secs: v236, time: v235, didSend: v43, from: v234 } = txn2;
  ;
  ;
  const v240 = stdlib.addressEq(v226, v234);
  stdlib.assert(v240, {
    at: './auction.rsh:62:6:dot',
    fs: [],
    msg: 'sender correct',
    who: 'Auctioneer'
    });
  stdlib.protect(ctc3, await interact.signal(), {
    at: './auction.rsh:65:40:application',
    fs: ['at ./auction.rsh:65:18:application call to [unknown function] (defined at: ./auction.rsh:65:22:function exp)'],
    msg: 'signal',
    who: 'Auctioneer'
    });
  
  const v243 = stdlib.add(v232, v230);
  let v244 = v228;
  let v245 = v243;
  let v246 = v226;
  let v247 = true;
  let v248 = stdlib.checkedBigNumberify('./auction.rsh:84:21:decimal', stdlib.UInt_max, 0);
  let v249 = v235;
  let v252 = v236;
  let v255 = stdlib.checkedBigNumberify('./auction.rsh:39:11:after expr stmt semicolon', stdlib.UInt_max, 0);
  let v256 = stdlib.checkedBigNumberify('./auction.rsh:59:15:decimal', stdlib.UInt_max, 1);
  
  while (await (async () => {
    
    return v247;})()) {
    const txn3 = await (ctc.recv({
      didSend: false,
      evt_cnt: 1,
      funcNum: 3,
      out_tys: [ctc5],
      timeoutAt: undefined,
      waitIfNotPresent: false
      }));
    const {data: [v280], secs: v282, time: v281, didSend: v149, from: v279 } = txn3;
    switch (v280[0]) {
      case 'Bidder_close0_61': {
        const v283 = v280[1];
        let v286;
        v286 = stdlib.checkedBigNumberify('./auction.rsh:124:17:decimal', stdlib.UInt_max, 0);
        const v292 = stdlib.add(v255, v286);
        ;
        undefined;
        const v295 = null;
        await txn3.getOutput('Bidder_close', 'v295', ctc3, v295);
        const cv244 = v244;
        const cv245 = v245;
        const cv246 = v246;
        const cv247 = false;
        const cv248 = v248;
        const cv249 = v281;
        const cv252 = v282;
        const cv255 = v292;
        const cv256 = v256;
        
        v244 = cv244;
        v245 = cv245;
        v246 = cv246;
        v247 = cv247;
        v248 = cv248;
        v249 = cv249;
        v252 = cv252;
        v255 = cv255;
        v256 = cv256;
        
        continue;
        break;
        }
      case 'Bidder_getBid0_61': {
        const v321 = v280[1];
        let v324;
        const v328 = v321[stdlib.checkedBigNumberify('./auction.rsh:101:11:spread', stdlib.UInt_max, 0)];
        v324 = v328;
        const v330 = stdlib.add(v255, v324);
        ;
        undefined;
        const v342 = stdlib.gt(v328, v244);
        stdlib.assert(v342, {
          at: './auction.rsh:105:18:application',
          fs: ['at ./auction.rsh:104:9:application call to [unknown function] (defined at: ./auction.rsh:104:9:function exp)'],
          msg: null,
          who: 'Auctioneer'
          });
        const v346 = stdlib.sub(v330, v248);
        ;
        const v347 = null;
        await txn3.getOutput('Bidder_getBid', 'v347', ctc3, v347);
        const v354 = stdlib.sub(v245, stdlib.checkedBigNumberify('./auction.rsh:114:33:decimal', stdlib.UInt_max, 600));
        const v355 = stdlib.gt(v252, v354);
        const v356 = stdlib.add(v245, stdlib.checkedBigNumberify('./auction.rsh:115:36:decimal', stdlib.UInt_max, 900));
        const v357 = v355 ? v356 : v245;
        const cv244 = v328;
        const cv245 = v357;
        const cv246 = v279;
        const cv247 = true;
        const cv248 = v328;
        const cv249 = v281;
        const cv252 = v282;
        const cv255 = v346;
        const cv256 = v256;
        
        v244 = cv244;
        v245 = cv245;
        v246 = cv246;
        v247 = cv247;
        v248 = cv248;
        v249 = cv249;
        v252 = cv252;
        v255 = cv255;
        v256 = cv256;
        
        continue;
        break;
        }
      }
    
    }
  const v360 = stdlib.lt(v255, v229);
  if (v360) {
    ;
    ;
    return;
    }
  else {
    ;
    ;
    return;
    }
  
  
  
  };
export async function Bidder_close(ctcTop, interact) {
  if (typeof(ctcTop) !== 'object' || ctcTop._initialize === undefined) {
    return Promise.reject(new Error(`The backend for Bidder_close expects to receive a contract as its first argument.`));}
  if (typeof(interact) !== 'object') {
    return Promise.reject(new Error(`The backend for Bidder_close expects to receive an interact object as its second argument.`));}
  const ctc = ctcTop._initialize();
  const stdlib = ctc.stdlib;
  const ctc0 = stdlib.T_Address;
  const ctc1 = stdlib.T_Token;
  const ctc2 = stdlib.T_UInt;
  const ctc3 = stdlib.T_Tuple([ctc2]);
  const ctc4 = stdlib.T_Data({
    Bidder_close0_61: ctc3,
    Bidder_getBid0_61: ctc3
    });
  const ctc5 = stdlib.T_Null;
  
  
  const [v226, v227, v229, v244, v245, v246, v248, v252, v255, v256] = await ctc.getState(stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 5), [ctc0, ctc1, ctc2, ctc2, ctc2, ctc0, ctc2, ctc2, ctc2, ctc2]);
  const v269 = stdlib.protect(ctc3, await interact.in(), {
    at: './auction.rsh:1:23:application',
    fs: ['at ./auction.rsh:123:11:application call to [unknown function] (defined at: ./auction.rsh:123:11:function exp)', 'at ./auction.rsh:81:19:application call to "runBidder_close0_61" (defined at: ./auction.rsh:123:11:function exp)', 'at ./auction.rsh:81:19:application call to [unknown function] (defined at: ./auction.rsh:81:19:function exp)'],
    msg: 'in',
    who: 'Bidder_close'
    });
  
  const v275 = ['Bidder_close0_61', v269];
  
  const txn1 = await (ctc.sendrecv({
    args: [v226, v227, v229, v244, v245, v246, v248, v252, v255, v256, v275],
    evt_cnt: 1,
    funcNum: 3,
    lct: stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 0),
    onlyIf: true,
    out_tys: [ctc4],
    pay: [stdlib.checkedBigNumberify('./auction.rsh:124:17:decimal', stdlib.UInt_max, 0), []],
    sim_p: (async (txn1) => {
      const sim_r = { txns: [], mapRefs: [], maps: [] };
      
      const {data: [v280], secs: v282, time: v281, didSend: v149, from: v279 } = txn1;
      
      switch (v280[0]) {
        case 'Bidder_close0_61': {
          const v283 = v280[1];
          let v286;
          v286 = stdlib.checkedBigNumberify('./auction.rsh:124:17:decimal', stdlib.UInt_max, 0);
          const v292 = stdlib.add(v255, v286);
          sim_r.txns.push({
            amt: v286,
            kind: 'to',
            tok: undefined
            });
          undefined;
          const v295 = null;
          const v296 = await txn1.getOutput('Bidder_close', 'v295', ctc5, v295);
          
          const v938 = stdlib.lt(v292, v229);
          if (v938) {
            sim_r.txns.push({
              amt: v292,
              kind: 'from',
              to: v246,
              tok: undefined
              });
            sim_r.txns.push({
              amt: v256,
              kind: 'from',
              to: v226,
              tok: v227
              });
            sim_r.txns.push({
              kind: 'halt',
              tok: v227
              })
            sim_r.txns.push({
              kind: 'halt',
              tok: undefined
              })
            sim_r.isHalt = true;
            }
          else {
            sim_r.txns.push({
              amt: v292,
              kind: 'from',
              to: v226,
              tok: undefined
              });
            sim_r.txns.push({
              amt: v256,
              kind: 'from',
              to: v246,
              tok: v227
              });
            sim_r.txns.push({
              kind: 'halt',
              tok: v227
              })
            sim_r.txns.push({
              kind: 'halt',
              tok: undefined
              })
            sim_r.isHalt = true;
            }
          break;
          }
        case 'Bidder_getBid0_61': {
          const v321 = v280[1];
          
          break;
          }
        }
      return sim_r;
      }),
    soloSend: false,
    timeoutAt: undefined,
    tys: [ctc0, ctc1, ctc2, ctc2, ctc2, ctc0, ctc2, ctc2, ctc2, ctc2, ctc4],
    waitIfNotPresent: false
    }));
  const {data: [v280], secs: v282, time: v281, didSend: v149, from: v279 } = txn1;
  switch (v280[0]) {
    case 'Bidder_close0_61': {
      const v283 = v280[1];
      let v286;
      v286 = stdlib.checkedBigNumberify('./auction.rsh:124:17:decimal', stdlib.UInt_max, 0);
      const v292 = stdlib.add(v255, v286);
      ;
      undefined;
      const v295 = null;
      const v296 = await txn1.getOutput('Bidder_close', 'v295', ctc5, v295);
      if (v149) {
        stdlib.protect(ctc5, await interact.out(v283, v296), {
          at: './auction.rsh:123:12:application',
          fs: ['at ./auction.rsh:123:12:application call to [unknown function] (defined at: ./auction.rsh:123:12:function exp)', 'at ./auction.rsh:126:12:application call to "k" (defined at: ./auction.rsh:125:9:function exp)', 'at ./auction.rsh:125:9:application call to [unknown function] (defined at: ./auction.rsh:125:9:function exp)'],
          msg: 'out',
          who: 'Bidder_close'
          });
        }
      else {
        }
      
      const v938 = stdlib.lt(v292, v229);
      if (v938) {
        ;
        ;
        return;
        }
      else {
        ;
        ;
        return;
        }
      break;
      }
    case 'Bidder_getBid0_61': {
      const v321 = v280[1];
      return;
      break;
      }
    }
  
  
  };
export async function Bidder_getBid(ctcTop, interact) {
  if (typeof(ctcTop) !== 'object' || ctcTop._initialize === undefined) {
    return Promise.reject(new Error(`The backend for Bidder_getBid expects to receive a contract as its first argument.`));}
  if (typeof(interact) !== 'object') {
    return Promise.reject(new Error(`The backend for Bidder_getBid expects to receive an interact object as its second argument.`));}
  const ctc = ctcTop._initialize();
  const stdlib = ctc.stdlib;
  const ctc0 = stdlib.T_Address;
  const ctc1 = stdlib.T_Token;
  const ctc2 = stdlib.T_UInt;
  const ctc3 = stdlib.T_Tuple([ctc2]);
  const ctc4 = stdlib.T_Data({
    Bidder_close0_61: ctc3,
    Bidder_getBid0_61: ctc3
    });
  const ctc5 = stdlib.T_Null;
  
  
  const [v226, v227, v229, v244, v245, v246, v248, v252, v255, v256] = await ctc.getState(stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 5), [ctc0, ctc1, ctc2, ctc2, ctc2, ctc0, ctc2, ctc2, ctc2, ctc2]);
  const v261 = stdlib.protect(ctc3, await interact.in(), {
    at: './auction.rsh:1:23:application',
    fs: ['at ./auction.rsh:102:9:application call to [unknown function] (defined at: ./auction.rsh:102:9:function exp)', 'at ./auction.rsh:81:19:application call to "runBidder_getBid0_61" (defined at: ./auction.rsh:101:11:function exp)', 'at ./auction.rsh:81:19:application call to [unknown function] (defined at: ./auction.rsh:81:19:function exp)'],
    msg: 'in',
    who: 'Bidder_getBid'
    });
  const v262 = v261[stdlib.checkedBigNumberify('./auction.rsh:101:11:spread', stdlib.UInt_max, 0)];
  const v263 = stdlib.gt(v262, v244);
  stdlib.assert(v263, {
    at: './auction.rsh:102:25:application',
    fs: ['at ./auction.rsh:102:9:application call to [unknown function] (defined at: ./auction.rsh:102:16:function exp)', 'at ./auction.rsh:102:9:application call to [unknown function] (defined at: ./auction.rsh:102:9:function exp)', 'at ./auction.rsh:81:19:application call to "runBidder_getBid0_61" (defined at: ./auction.rsh:101:11:function exp)', 'at ./auction.rsh:81:19:application call to [unknown function] (defined at: ./auction.rsh:81:19:function exp)'],
    msg: 'bid is too low',
    who: 'Bidder_getBid'
    });
  
  const v277 = ['Bidder_getBid0_61', v261];
  
  const txn1 = await (ctc.sendrecv({
    args: [v226, v227, v229, v244, v245, v246, v248, v252, v255, v256, v277],
    evt_cnt: 1,
    funcNum: 3,
    lct: stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 0),
    onlyIf: true,
    out_tys: [ctc4],
    pay: [v262, []],
    sim_p: (async (txn1) => {
      const sim_r = { txns: [], mapRefs: [], maps: [] };
      
      const {data: [v280], secs: v282, time: v281, didSend: v149, from: v279 } = txn1;
      
      switch (v280[0]) {
        case 'Bidder_close0_61': {
          const v283 = v280[1];
          
          break;
          }
        case 'Bidder_getBid0_61': {
          const v321 = v280[1];
          let v324;
          const v328 = v321[stdlib.checkedBigNumberify('./auction.rsh:101:11:spread', stdlib.UInt_max, 0)];
          v324 = v328;
          const v330 = stdlib.add(v255, v324);
          sim_r.txns.push({
            amt: v324,
            kind: 'to',
            tok: undefined
            });
          undefined;
          const v342 = stdlib.gt(v328, v244);
          stdlib.assert(v342, {
            at: './auction.rsh:105:18:application',
            fs: ['at ./auction.rsh:104:9:application call to [unknown function] (defined at: ./auction.rsh:104:9:function exp)'],
            msg: null,
            who: 'Bidder_getBid'
            });
          const v346 = stdlib.sub(v330, v248);
          sim_r.txns.push({
            amt: v248,
            kind: 'from',
            to: v246,
            tok: undefined
            });
          const v347 = null;
          const v348 = await txn1.getOutput('Bidder_getBid', 'v347', ctc5, v347);
          
          const v354 = stdlib.sub(v245, stdlib.checkedBigNumberify('./auction.rsh:114:33:decimal', stdlib.UInt_max, 600));
          const v355 = stdlib.gt(v252, v354);
          const v356 = stdlib.add(v245, stdlib.checkedBigNumberify('./auction.rsh:115:36:decimal', stdlib.UInt_max, 900));
          const v357 = v355 ? v356 : v245;
          const v959 = v328;
          const v960 = v357;
          const v961 = v279;
          const v963 = v328;
          const v965 = v282;
          const v966 = v346;
          const v967 = v256;
          sim_r.isHalt = false;
          
          break;
          }
        }
      return sim_r;
      }),
    soloSend: false,
    timeoutAt: undefined,
    tys: [ctc0, ctc1, ctc2, ctc2, ctc2, ctc0, ctc2, ctc2, ctc2, ctc2, ctc4],
    waitIfNotPresent: false
    }));
  const {data: [v280], secs: v282, time: v281, didSend: v149, from: v279 } = txn1;
  switch (v280[0]) {
    case 'Bidder_close0_61': {
      const v283 = v280[1];
      return;
      break;
      }
    case 'Bidder_getBid0_61': {
      const v321 = v280[1];
      let v324;
      const v328 = v321[stdlib.checkedBigNumberify('./auction.rsh:101:11:spread', stdlib.UInt_max, 0)];
      v324 = v328;
      const v330 = stdlib.add(v255, v324);
      ;
      undefined;
      const v342 = stdlib.gt(v328, v244);
      stdlib.assert(v342, {
        at: './auction.rsh:105:18:application',
        fs: ['at ./auction.rsh:104:9:application call to [unknown function] (defined at: ./auction.rsh:104:9:function exp)'],
        msg: null,
        who: 'Bidder_getBid'
        });
      const v346 = stdlib.sub(v330, v248);
      ;
      const v347 = null;
      const v348 = await txn1.getOutput('Bidder_getBid', 'v347', ctc5, v347);
      if (v149) {
        stdlib.protect(ctc5, await interact.out(v321, v348), {
          at: './auction.rsh:101:12:application',
          fs: ['at ./auction.rsh:101:12:application call to [unknown function] (defined at: ./auction.rsh:101:12:function exp)', 'at ./auction.rsh:107:12:application call to "k" (defined at: ./auction.rsh:104:9:function exp)', 'at ./auction.rsh:104:9:application call to [unknown function] (defined at: ./auction.rsh:104:9:function exp)'],
          msg: 'out',
          who: 'Bidder_getBid'
          });
        }
      else {
        }
      
      const v354 = stdlib.sub(v245, stdlib.checkedBigNumberify('./auction.rsh:114:33:decimal', stdlib.UInt_max, 600));
      const v355 = stdlib.gt(v252, v354);
      const v356 = stdlib.add(v245, stdlib.checkedBigNumberify('./auction.rsh:115:36:decimal', stdlib.UInt_max, 900));
      const v357 = v355 ? v356 : v245;
      const v959 = v328;
      const v960 = v357;
      const v961 = v279;
      const v963 = v328;
      const v965 = v282;
      const v966 = v346;
      const v967 = v256;
      return;
      
      break;
      }
    }
  
  
  };
const _ALGO = {
  appApproval: `#pragma version 5
txn RekeyTo
global ZeroAddress
==
assert
txn Lease
global ZeroAddress
==
assert
int 0
store 0
txn ApplicationID
bz alloc
byte base64()
app_global_get
dup
int 0
extract_uint64
store 1
int 8
extract_uint64
store 2
txn NumAppArgs
int 3
==
assert
txna ApplicationArgs 0
btoi
preamble:
// Handler 0
dup
int 0
==
bz l0_afterHandler0
pop
// check step
int 0
load 1
==
assert
// check time
txna ApplicationArgs 1
btoi
dup
int 0
==
swap
load 2
==
||
assert
byte base64()
pop
txna ApplicationArgs 2
dup
len
int 32
==
assert
dup
int 0
extract_uint64
store 255
dup
int 8
extract_uint64
store 254
dup
int 16
extract_uint64
store 253
dup
int 24
extract_uint64
store 252
pop
// "CheckPay"
// "./auction.rsh:54:6:dot"
// "[]"
int 100000
dup
bz l1_checkTxnK
load 0
dup
int 1
+
store 0
swap
dig 1
gtxns Amount
==
assert
int pay
dig 1
gtxns TypeEnum
==
assert
int 0
dig 1
gtxns Fee
==
assert
global ZeroAddress
dig 1
gtxns Lease
==
assert
global ZeroAddress
dig 1
gtxns RekeyTo
==
assert
global CurrentApplicationAddress
dig 1
gtxns Receiver
==
assert
l1_checkTxnK:
pop
// Initializing token
int 100000
dup
bz l2_checkTxnK
load 0
dup
int 1
+
store 0
swap
dig 1
gtxns Amount
==
assert
int pay
dig 1
gtxns TypeEnum
==
assert
int 0
dig 1
gtxns Fee
==
assert
global ZeroAddress
dig 1
gtxns Lease
==
assert
global ZeroAddress
dig 1
gtxns RekeyTo
==
assert
global CurrentApplicationAddress
dig 1
gtxns Receiver
==
assert
l2_checkTxnK:
pop
int 0
itxn_begin
itxn_field AssetAmount
int axfer
itxn_field TypeEnum
global CurrentApplicationAddress
itxn_field AssetReceiver
load 255
itxn_field XferAsset
itxn_submit
int 0
l3_makeTxnK:
pop
// "CheckPay"
// "./auction.rsh:54:6:dot"
// "[]"
txn Sender
load 255
itob
concat
load 254
itob
concat
load 253
itob
concat
load 252
itob
concat
global LatestTimestamp
itob
concat
int 1
bzero
dig 1
extract 0 72
app_global_put
pop
int 1
store 1
global Round
store 2
txn OnCompletion
int NoOp
==
assert
b updateState
l0_afterHandler0:
// Handler 1
dup
int 1
==
bz l4_afterHandler1
pop
// check step
int 1
load 1
==
assert
// check time
txna ApplicationArgs 1
btoi
dup
int 0
==
swap
load 2
==
||
assert
int 1
bzero
app_global_get
dup
extract 0 32
store 255
dup
int 32
extract_uint64
store 254
dup
int 40
extract_uint64
store 253
dup
int 48
extract_uint64
store 252
dup
int 56
extract_uint64
store 251
dup
int 64
extract_uint64
store 250
pop
txna ApplicationArgs 2
dup
len
int 0
==
assert
pop
// "CheckPay"
// "./auction.rsh:62:6:dot"
// "[]"
// "CheckPay"
// "./auction.rsh:62:6:dot"
// "[]"
int 1
dup
bz l5_checkTxnK
load 0
dup
int 1
+
store 0
swap
dig 1
gtxns AssetAmount
==
assert
load 254
dig 1
gtxns XferAsset
==
assert
int axfer
dig 1
gtxns TypeEnum
==
assert
int 0
dig 1
gtxns Fee
==
assert
global ZeroAddress
dig 1
gtxns Lease
==
assert
global ZeroAddress
dig 1
gtxns RekeyTo
==
assert
global CurrentApplicationAddress
dig 1
gtxns AssetReceiver
==
assert
l5_checkTxnK:
pop
// Just "sender correct"
// "./auction.rsh:62:6:dot"
// "[]"
load 255
txn Sender
==
assert
load 255
load 254
itob
concat
load 252
itob
concat
load 253
itob
load 250
load 251
+
itob
concat
load 255
concat
int 1
itob // bool
substring 7 8
concat
int 8
bzero
concat
global Round
itob
concat
global LatestTimestamp
itob
concat
int 8
bzero
concat
byte base64(AAAAAAAAAAE=)
concat
b loopBody2
l4_afterHandler1:
l6_afterHandler2:
// Handler 3
dup
int 3
==
bz l7_afterHandler3
pop
// check step
int 5
load 1
==
assert
// check time
txna ApplicationArgs 1
btoi
dup
int 0
==
swap
load 2
==
||
assert
int 1
bzero
app_global_get
byte base64(AQ==)
app_global_get
concat
dup
extract 0 32
store 255
dup
int 32
extract_uint64
store 254
dup
int 40
extract_uint64
store 253
dup
int 48
extract_uint64
store 252
dup
int 56
extract_uint64
store 251
dup
extract 64 32
store 250
dup
int 96
extract_uint64
store 249
dup
int 104
extract_uint64
store 248
dup
int 112
extract_uint64
store 247
dup
int 120
extract_uint64
store 246
pop
txna ApplicationArgs 2
dup
len
int 9
==
assert
dup
store 245
pop
load 245
int 0
getbyte
int 0
==
bz l9_switchAfterBidder_close0_61
int 0
store 244
// "CheckPay"
// "./auction.rsh:81:19:dot"
// "[]"
load 244
dup
bz l10_checkTxnK
load 0
dup
int 1
+
store 0
swap
dig 1
gtxns Amount
==
assert
int pay
dig 1
gtxns TypeEnum
==
assert
int 0
dig 1
gtxns Fee
==
assert
global ZeroAddress
dig 1
gtxns Lease
==
assert
global ZeroAddress
dig 1
gtxns RekeyTo
==
assert
global CurrentApplicationAddress
dig 1
gtxns Receiver
==
assert
l10_checkTxnK:
pop
byte base64(AAAAAAAAASc=)
log // 8
byte base64()
load 255
load 254
itob
concat
load 253
itob
concat
load 252
itob
load 251
itob
concat
load 250
concat
int 0
itob // bool
substring 7 8
concat
load 249
itob
concat
global Round
itob
concat
global LatestTimestamp
itob
concat
load 247
load 244
+
itob
concat
load 246
itob
concat
b loopBody2
l9_switchAfterBidder_close0_61:
load 245
int 0
getbyte
int 1
==
bz l11_switchAfterBidder_getBid0_61
load 245
extract 1 8
dup
store 244
btoi
dup
store 242
store 243
// "CheckPay"
// "./auction.rsh:81:19:dot"
// "[]"
load 243
dup
bz l12_checkTxnK
load 0
dup
int 1
+
store 0
swap
dig 1
gtxns Amount
==
assert
int pay
dig 1
gtxns TypeEnum
==
assert
int 0
dig 1
gtxns Fee
==
assert
global ZeroAddress
dig 1
gtxns Lease
==
assert
global ZeroAddress
dig 1
gtxns RekeyTo
==
assert
global CurrentApplicationAddress
dig 1
gtxns Receiver
==
assert
l12_checkTxnK:
pop
// Nothing
// "./auction.rsh:105:18:application"
// "[at ./auction.rsh:104:9:application call to [unknown function] (defined at: ./auction.rsh:104:9:function exp)]"
load 242
load 252
>
assert
load 249
dup
bz l13_makeTxnK
itxn_begin
itxn_field Amount
int pay
itxn_field TypeEnum
load 250
itxn_field Receiver
itxn_submit
int 0
l13_makeTxnK:
pop
byte base64(AAAAAAAAAVs=)
log // 8
byte base64()
load 255
load 254
itob
concat
load 253
itob
concat
load 242
itob
load 251
dup
int 900
+
load 248
load 251
int 600
-
>
select
itob
concat
txn Sender
concat
int 1
itob // bool
substring 7 8
concat
load 242
itob
concat
global Round
itob
concat
global LatestTimestamp
itob
concat
load 247
load 243
+
load 249
-
itob
concat
load 246
itob
concat
b loopBody2
l11_switchAfterBidder_getBid0_61:
l8_switchK:
l7_afterHandler3:
int 0
assert
loopBody2:
dup
int 0
extract_uint64
store 255
dup
int 8
extract_uint64
store 254
dup
extract 16 32
store 253
dup
extract 48 1
btoi
store 252
dup
int 49
extract_uint64
store 251
dup
int 57
extract_uint64
store 250
dup
int 65
extract_uint64
store 249
dup
int 73
extract_uint64
store 248
dup
int 81
extract_uint64
store 247
pop
dup
extract 0 32
store 246
dup
int 32
extract_uint64
store 245
dup
int 40
extract_uint64
store 244
pop
load 252
bz l14_ifF
load 246
load 245
itob
concat
load 244
itob
concat
load 255
itob
concat
load 254
itob
concat
load 253
concat
load 251
itob
concat
load 249
itob
concat
load 248
itob
concat
load 247
itob
concat
int 1
bzero
dig 1
extract 0 127
app_global_put
byte base64(AQ==)
dig 1
extract 127 1
app_global_put
pop
int 5
store 1
global Round
store 2
txn OnCompletion
int NoOp
==
assert
b updateState
l14_ifF:
load 248
load 244
<
bz l15_ifF
load 248
dup
bz l16_makeTxnK
itxn_begin
itxn_field Amount
int pay
itxn_field TypeEnum
load 253
itxn_field Receiver
itxn_submit
int 0
l16_makeTxnK:
pop
load 247
dup
bz l17_makeTxnK
itxn_begin
itxn_field AssetAmount
int axfer
itxn_field TypeEnum
load 246
itxn_field AssetReceiver
load 245
itxn_field XferAsset
itxn_submit
int 0
l17_makeTxnK:
pop
int 0
itxn_begin
itxn_field AssetAmount
int axfer
itxn_field TypeEnum
global CreatorAddress
itxn_field AssetCloseTo
global CurrentApplicationAddress
itxn_field AssetReceiver
load 245
itxn_field XferAsset
itxn_submit
int 0
l18_makeTxnK:
pop
int 0
itxn_begin
itxn_field Amount
int pay
itxn_field TypeEnum
global CreatorAddress
itxn_field CloseRemainderTo
global CurrentApplicationAddress
itxn_field Receiver
itxn_submit
int 0
l19_makeTxnK:
pop
txn OnCompletion
int DeleteApplication
==
assert
b updateState
l15_ifF:
load 248
dup
bz l20_makeTxnK
itxn_begin
itxn_field Amount
int pay
itxn_field TypeEnum
load 246
itxn_field Receiver
itxn_submit
int 0
l20_makeTxnK:
pop
load 247
dup
bz l21_makeTxnK
itxn_begin
itxn_field AssetAmount
int axfer
itxn_field TypeEnum
load 253
itxn_field AssetReceiver
load 245
itxn_field XferAsset
itxn_submit
int 0
l21_makeTxnK:
pop
int 0
itxn_begin
itxn_field AssetAmount
int axfer
itxn_field TypeEnum
global CreatorAddress
itxn_field AssetCloseTo
global CurrentApplicationAddress
itxn_field AssetReceiver
load 245
itxn_field XferAsset
itxn_submit
int 0
l22_makeTxnK:
pop
int 0
itxn_begin
itxn_field Amount
int pay
itxn_field TypeEnum
global CreatorAddress
itxn_field CloseRemainderTo
global CurrentApplicationAddress
itxn_field Receiver
itxn_submit
int 0
l23_makeTxnK:
pop
txn OnCompletion
int DeleteApplication
==
assert
updateState:
byte base64()
load 1
itob
load 2
itob
concat
app_global_put
checkSize:
load 0
dup
dup
int 1
+
global GroupSize
==
assert
txn GroupIndex
==
assert
int 1000
*
txn Fee
<=
assert
done:
int 1
return
alloc:
txn OnCompletion
int NoOp
==
assert
int 0
store 1
int 0
store 2
b updateState
`,
  appClear: `#pragma version 5
int 0
`,
  mapDataKeys: 0,
  mapDataSize: 0,
  stateKeys: 2,
  stateSize: 128,
  unsupported: [],
  version: 6
  };
const _ETH = {
  ABI: `[
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "address payable",
                "name": "v227",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "v228",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "v229",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "v230",
                "type": "uint256"
              }
            ],
            "internalType": "struct T2",
            "name": "msg",
            "type": "tuple"
          }
        ],
        "internalType": "struct T3",
        "name": "_a",
        "type": "tuple"
      }
    ],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "msg",
        "type": "uint256"
      }
    ],
    "name": "ReachError",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "address payable",
                "name": "v227",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "v228",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "v229",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "v230",
                "type": "uint256"
              }
            ],
            "internalType": "struct T2",
            "name": "msg",
            "type": "tuple"
          }
        ],
        "indexed": false,
        "internalType": "struct T3",
        "name": "_a",
        "type": "tuple"
      }
    ],
    "name": "_reach_e0",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "msg",
            "type": "bool"
          }
        ],
        "indexed": false,
        "internalType": "struct T8",
        "name": "_a",
        "type": "tuple"
      }
    ],
    "name": "_reach_e1",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          },
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "enum _enum_T10",
                    "name": "which",
                    "type": "uint8"
                  },
                  {
                    "components": [
                      {
                        "internalType": "uint256",
                        "name": "elem0",
                        "type": "uint256"
                      }
                    ],
                    "internalType": "struct T9",
                    "name": "_Bidder_close0_61",
                    "type": "tuple"
                  },
                  {
                    "components": [
                      {
                        "internalType": "uint256",
                        "name": "elem0",
                        "type": "uint256"
                      }
                    ],
                    "internalType": "struct T9",
                    "name": "_Bidder_getBid0_61",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct T10",
                "name": "v280",
                "type": "tuple"
              }
            ],
            "internalType": "struct T11",
            "name": "msg",
            "type": "tuple"
          }
        ],
        "indexed": false,
        "internalType": "struct T12",
        "name": "_a",
        "type": "tuple"
      }
    ],
    "name": "_reach_e3",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bool",
        "name": "v0",
        "type": "bool"
      }
    ],
    "name": "_reach_oe_v295",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bool",
        "name": "v0",
        "type": "bool"
      }
    ],
    "name": "_reach_oe_v347",
    "type": "event"
  },
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [],
    "name": "Auction_currentPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "Auction_endSecs",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "Auction_highestBidder",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "Auction_token",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_a0",
        "type": "uint256"
      }
    ],
    "name": "Bidder_close",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_a0",
        "type": "uint256"
      }
    ],
    "name": "Bidder_getBid",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_reachCreationTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_reachCurrentState",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_reachCurrentTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "msg",
            "type": "bool"
          }
        ],
        "internalType": "struct T8",
        "name": "_a",
        "type": "tuple"
      }
    ],
    "name": "_reach_m1",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "time",
            "type": "uint256"
          },
          {
            "components": [
              {
                "components": [
                  {
                    "internalType": "enum _enum_T10",
                    "name": "which",
                    "type": "uint8"
                  },
                  {
                    "components": [
                      {
                        "internalType": "uint256",
                        "name": "elem0",
                        "type": "uint256"
                      }
                    ],
                    "internalType": "struct T9",
                    "name": "_Bidder_close0_61",
                    "type": "tuple"
                  },
                  {
                    "components": [
                      {
                        "internalType": "uint256",
                        "name": "elem0",
                        "type": "uint256"
                      }
                    ],
                    "internalType": "struct T9",
                    "name": "_Bidder_getBid0_61",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct T10",
                "name": "v280",
                "type": "tuple"
              }
            ],
            "internalType": "struct T11",
            "name": "msg",
            "type": "tuple"
          }
        ],
        "internalType": "struct T12",
        "name": "_a",
        "type": "tuple"
      }
    ],
    "name": "_reach_m3",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]`,
  Bytecode: `0x608060405260405162001fab38038062001fab8339810160408190526200002691620002aa565b6000805543600355604080518251815260208084015180516001600160a01b0316828401529081015182840152808301516060808401919091520151608082015290517f71dd9d263dcbce3d29f6597df8fd5e86f93dde10e7cdaec0faba0640a08d20059181900360a00190a1620000a13415600b620001a3565b620000ed6040518060c0016040528060006001600160a01b0316815260200160006001600160a01b03168152602001600081526020016000815260200160008152602001600081525090565b3380825260208381018051516001600160a01b039081168386019081528251840151604080880191825284518101516060808a0191825295518601516080808b019182524260a0808d01918252600160008190554390558551808c019c909c5296519097168a85015293519689019690965251918701919091529251908501525160c0808501919091528151808503909101815260e0909301905281516200019a926002920190620001cd565b505050620003a1565b81620001c95760405163100960cb60e01b81526004810182905260240160405180910390fd5b5050565b828054620001db9062000364565b90600052602060002090601f016020900481019282620001ff57600085556200024a565b82601f106200021a57805160ff19168380011785556200024a565b828001600101855582156200024a579182015b828111156200024a5782518255916020019190600101906200022d565b50620002589291506200025c565b5090565b5b808211156200025857600081556001016200025d565b604051608081016001600160401b0381118282101715620002a457634e487b7160e01b600052604160045260246000fd5b60405290565b600081830360a0811215620002be57600080fd5b604080519081016001600160401b0381118282101715620002ef57634e487b7160e01b600052604160045260246000fd5b604052835181526080601f19830112156200030957600080fd5b6200031362000273565b60208501519092506001600160a01b03811681146200033157600080fd5b80835250604084015160208301526060840151604083015260808401516060830152816020820152809250505092915050565b600181811c908216806200037957607f821691505b602082108114156200039b57634e487b7160e01b600052602260045260246000fd5b50919050565b611bfa80620003b16000396000f3fe60806040526004361061009a5760003560e01c806347fbf31f1161006157806347fbf31f1461014c5780636009475e1461016c5780638047e42f1461017f5780638323075714610194578063ab53f2c6146101a9578063d336c069146101cc57005b806312a0e79a146100a35780631e93b0f1146100d85780631fa4d584146100f75780632c10a159146101245780633ccbd5701461013757005b366100a157005b005b3480156100af57600080fd5b506100c36100be366004611609565b6101e1565b60405190151581526020015b60405180910390f35b3480156100e457600080fd5b506003545b6040519081526020016100cf565b34801561010357600080fd5b5061010c610245565b6040516001600160a01b0390911681526020016100cf565b6100a1610132366004611622565b6103c6565b34801561014357600080fd5b506100e96103f6565b34801561015857600080fd5b506100c3610167366004611609565b610574565b6100a161017a36600461163a565b6105d5565b34801561018b57600080fd5b5061010c610601565b3480156101a057600080fd5b506001546100e9565b3480156101b557600080fd5b506101be61077f565b6040516100cf929190611678565b3480156101d857600080fd5b506100e961081c565b6040805180820190915260008082526020820181905290610200611408565b610208611427565b604080516020808201835287825283830191909152600183528151808201909252828252830152610239828461099a565b50506020015192915050565b60006001600054141561030257600060028054610261906116c8565b80601f016020809104026020016040519081016040528092919081815260200182805461028d906116c8565b80156102da5780601f106102af576101008083540402835291602001916102da565b820191906000526020600020905b8154815290600101906020018083116102bd57829003601f168201915b50505050508060200190518101906102f291906117b3565b905061030060006009610d8b565b505b600560005414156103b75760006002805461031c906116c8565b80601f0160208091040260200160405190810160405280929190818152602001828054610348906116c8565b80156103955780601f1061036a57610100808354040283529160200191610395565b820191906000526020600020905b81548152906001019060200180831161037857829003601f168201915b50505050508060200190518101906103ad9190611847565b60a0015192915050565b6103c360006009610d8b565b90565b60408051808201909152600080825260208201526103f26103ec368490038401846118ee565b82610db1565b5050565b6000600160005414156104b357600060028054610412906116c8565b80601f016020809104026020016040519081016040528092919081815260200182805461043e906116c8565b801561048b5780601f106104605761010080835404028352916020019161048b565b820191906000526020600020905b81548152906001019060200180831161046e57829003601f168201915b50505050508060200190518101906104a391906117b3565b90506104b160006008610d8b565b505b60056000541415610568576000600280546104cd906116c8565b80601f01602080910402602001604051908101604052809291908181526020018280546104f9906116c8565b80156105465780601f1061051b57610100808354040283529160200191610546565b820191906000526020600020905b81548152906001019060200180831161052957829003601f168201915b505050505080602001905181019061055e9190611847565b6080015192915050565b6103c360006008610d8b565b6040805180820190915260008082526020820181905290610593611408565b61059b611427565b6040805160208082018352878252838101919091526000835281518082019092528282528301526105cc828461099a565b50505192915050565b60408051808201909152600080825260208201526103f26105fb368490038401846119a2565b8261099a565b6000600160005414156106be5760006002805461061d906116c8565b80601f0160208091040260200160405190810160405280929190818152602001828054610649906116c8565b80156106965780601f1061066b57610100808354040283529160200191610696565b820191906000526020600020905b81548152906001019060200180831161067957829003601f168201915b50505050508060200190518101906106ae91906117b3565b90506106bc6000600a610d8b565b505b60056000541415610773576000600280546106d8906116c8565b80601f0160208091040260200160405190810160405280929190818152602001828054610704906116c8565b80156107515780601f1061072657610100808354040283529160200191610751565b820191906000526020600020905b81548152906001019060200180831161073457829003601f168201915b50505050508060200190518101906107699190611847565b6020015192915050565b6103c36000600a610d8b565b600060606000546002808054610794906116c8565b80601f01602080910402602001604051908101604052809291908181526020018280546107c0906116c8565b801561080d5780601f106107e25761010080835404028352916020019161080d565b820191906000526020600020905b8154815290600101906020018083116107f057829003601f168201915b50505050509050915091509091565b6000600160005414156108d957600060028054610838906116c8565b80601f0160208091040260200160405190810160405280929190818152602001828054610864906116c8565b80156108b15780601f10610886576101008083540402835291602001916108b1565b820191906000526020600020905b81548152906001019060200180831161089457829003601f168201915b50505050508060200190518101906108c991906117b3565b90506108d760006007610d8b565b505b6005600054141561098e576000600280546108f3906116c8565b80601f016020809104026020016040519081016040528092919081815260200182805461091f906116c8565b801561096c5780601f106109415761010080835404028352916020019161096c565b820191906000526020600020905b81548152906001019060200180831161094f57829003601f168201915b50505050508060200190518101906109849190611847565b6060015192915050565b6103c360006007610d8b565b6109aa6005600054146014610d8b565b81516109c59015806109be57508251600154145b6015610d8b565b6000808055600280546109d7906116c8565b80601f0160208091040260200160405190810160405280929190818152602001828054610a03906116c8565b8015610a505780601f10610a2557610100808354040283529160200191610a50565b820191906000526020600020905b815481529060010190602001808311610a3357829003601f168201915b5050505050806020019051810190610a689190611847565b9050610a7261146b565b7f2206f5c60f94d7fd6e082564e09cd08bafceb58e2319db26c381bd230fffbdcd84604051610aa19190611a5a565b60405180910390a16000602085015151516001811115610ac357610ac36116b2565b1415610bd15760008152610ad934156011610d8b565b604051600181527fbc8de5c89f3ea1e23e41ba2caf6909b6efa7a4ef8236eef6de73b4d3bc357fe89060200160405180910390a160018352610b196114a0565b825181516001600160a01b039182169052602080850151835190831690820152604080860151845182015260608087015183860180519190915260808089015182519095019490945260a0808901518251961695909301949094528351600091015260c0808701518451909301929092528251439101529051429101528151610100840151610ba89190611ac4565b60208201805160e0019190915261012084015190516101000152610bcb81610fb4565b50610d85565b6001602085015151516001811115610beb57610beb6116b2565b1415610d8557602080850151516040908101519183018290529051908201819052610c199034146012610d8b565b610c328260600151826020015160000151116013610d8b565b8160a001516001600160a01b03166108fc8360c001519081150290604051600060405180830381858888f19350505050158015610c73573d6000803e3d6000fd5b50604051600181527fcdda553ea2b1fd100ca8f5ac3e7328ce97b93d9c29b2f13f8209a49dfa6128209060200160405180910390a160016020840152610cb76114a0565b825181516001600160a01b0391821690526020808501518351921691810191909152604080850151835190910152828101515190820151526080830151610d019061025890611adc565b8360e0015111610d15578260800151610d27565b6103848360800151610d279190611ac4565b6020808301805182019290925281513360409182015282516001606090910152908401515182516080015281514360a09091015290514260c09182015284015190830151610100850151610d7b9190611ac4565b610ba89190611adc565b50505050565b816103f25760405163100960cb60e01b8152600481018290526024015b60405180910390fd5b610dc1600160005414600f610d8b565b8151610ddc901580610dd557508251600154145b6010610d8b565b600080805560028054610dee906116c8565b80601f0160208091040260200160405190810160405280929190818152602001828054610e1a906116c8565b8015610e675780601f10610e3c57610100808354040283529160200191610e67565b820191906000526020600020905b815481529060010190602001808311610e4a57829003601f168201915b5050505050806020019051810190610e7f91906117b3565b60408051855181526020808701511515908201529192507f79ca1a789d797004bc78dff9632d64e202e102f2d008dcc20c5a645ef7d4a7d1910160405180910390a1610ecd3415600c610d8b565b610ee7610ee033836020015160016111f6565b600d610d8b565b8051610eff906001600160a01b03163314600e610d8b565b610f076114a0565b815181516001600160a01b0391821690526020808401518351921691810191909152606083015182516040908101919091528301519082015152608082015160a0830151610f559190611ac4565b6020808301805190910191909152825181516001600160a01b0390911660409091015280516001606090910181905281516000608090910181905282514360a09091015282514260c090910152825160e0015290516101000152610d85815b806020015160600151156110f95761103360405180610140016040528060006001600160a01b0316815260200160006001600160a01b0316815260200160008152602001600081526020016000815260200160006001600160a01b03168152602001600081526020016000815260200160008152602001600081525090565b8151516001600160a01b039081168252825160209081015182168184015283516040908101518185015281850180515160608601528051830151608080870191909152815183015190941660a086015280519093015160c0808601919091528351015160e080860191909152835101516101008086019190915292519092015161012084015260056000554360015590516110d091839101611af3565b604051602081830303815290604052600290805190602001906110f4929190611523565b505050565b805160400151602082015160e00151101561118f578060200151604001516001600160a01b03166108fc826020015160e001519081150290604051600060405180830381858888f19350505050158015611157573d6000803e3d6000fd5b508051602080820151915190830151610100015161117692919061120e565b6000808055600181905561118c906002906115a7565b50565b805151602082015160e001516040516001600160a01b039092169181156108fc0291906000818181858888f193505050501580156111d1573d6000803e3d6000fd5b506111768160000151602001518260200151604001518360200151610100015161120e565b600061120483853085611222565b90505b9392505050565b6112198383836112fc565b6110f457600080fd5b604080516001600160a01b0385811660248301528481166044830152606480830185905283518084039091018152608490920183526020820180516001600160e01b03166323b872dd60e01b17905291516000928392839291891691839161128991611b8b565b60006040518083038185875af1925050503d80600081146112c6576040519150601f19603f3d011682016040523d82523d6000602084013e6112cb565b606091505b50915091506112dc828260016113cd565b50808060200190518101906112f19190611ba7565b979650505050505050565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663a9059cbb60e01b17905291516000928392839291881691839161135b91611b8b565b60006040518083038185875af1925050503d8060008114611398576040519150601f19603f3d011682016040523d82523d6000602084013e61139d565b606091505b50915091506113ae828260026113cd565b50808060200190518101906113c39190611ba7565b9695505050505050565b606083156113dc575081611207565b8251156113ec5782518084602001fd5b60405163100960cb60e01b815260048101839052602401610da8565b6040518060400160405280600081526020016114226115e1565b905290565b604080516060810190915280600081526020016114506040518060200160405280600081525090565b81526020016114226040518060200160405280600081525090565b6040518060600160405280600081526020016114936040518060200160405280600081525090565b8152602001600081525090565b6040805160a08101825260009181018281526060820183905260808201929092529081908152602001611422604051806101200160405280600081526020016000815260200160006001600160a01b0316815260200160001515815260200160008152602001600081526020016000815260200160008152602001600081525090565b82805461152f906116c8565b90600052602060002090601f0160209004810192826115515760008555611597565b82601f1061156a57805160ff1916838001178555611597565b82800160010185558215611597579182015b8281111561159757825182559160200191906001019061157c565b506115a39291506115f4565b5090565b5080546115b3906116c8565b6000825580601f106115c3575050565b601f01602090049060005260206000209081019061118c91906115f4565b6040518060200160405280611422611427565b5b808211156115a357600081556001016115f5565b60006020828403121561161b57600080fd5b5035919050565b60006040828403121561163457600080fd5b50919050565b60006080828403121561163457600080fd5b60005b8381101561166757818101518382015260200161164f565b83811115610d855750506000910152565b828152604060208201526000825180604084015261169d81606085016020870161164c565b601f01601f1916919091016060019392505050565b634e487b7160e01b600052602160045260246000fd5b600181811c908216806116dc57607f821691505b6020821081141561163457634e487b7160e01b600052602260045260246000fd5b604051610140810167ffffffffffffffff8111828210171561172f57634e487b7160e01b600052604160045260246000fd5b60405290565b6040516020810167ffffffffffffffff8111828210171561172f57634e487b7160e01b600052604160045260246000fd5b6040516060810167ffffffffffffffff8111828210171561172f57634e487b7160e01b600052604160045260246000fd5b80516001600160a01b03811681146117ae57600080fd5b919050565b600060c082840312156117c557600080fd5b60405160c0810181811067ffffffffffffffff821117156117f657634e487b7160e01b600052604160045260246000fd5b60405261180283611797565b815261181060208401611797565b602082015260408301516040820152606083015160608201526080830151608082015260a083015160a08201528091505092915050565b6000610140828403121561185a57600080fd5b6118626116fd565b61186b83611797565b815261187960208401611797565b60208201526040830151604082015260608301516060820152608083015160808201526118a860a08401611797565b60a082015260c0838101519082015260e080840151908201526101008084015190820152610120928301519281019290925250919050565b801515811461118c57600080fd5b60006040828403121561190057600080fd5b6040516040810181811067ffffffffffffffff8211171561193157634e487b7160e01b600052604160045260246000fd5b604052823581526020830135611946816118e0565b60208201529392505050565b60006020828403121561196457600080fd5b6040516020810181811067ffffffffffffffff8211171561199557634e487b7160e01b600052604160045260246000fd5b6040529135825250919050565b600081830360808112156119b557600080fd5b6040516040810181811067ffffffffffffffff821117156119e657634e487b7160e01b600052604160045260246000fd5b604052833581526060601f19830112156119ff57600080fd5b611a07611735565b9150611a11611766565b602085013560028110611a2357600080fd5b8152611a328660408701611952565b6020820152611a448660608701611952565b6040820152825260208101919091529392505050565b81518152602082015151805160808301919060028110611a8a57634e487b7160e01b600052602160045260246000fd5b80602085015250602081015151604084015260408101515160608401525092915050565b634e487b7160e01b600052601160045260246000fd5b60008219821115611ad757611ad7611aae565b500190565b600082821015611aee57611aee611aae565b500390565b81516001600160a01b0316815261014081016020830151611b1f60208401826001600160a01b03169052565b5060408301516040830152606083015160608301526080830151608083015260a0830151611b5860a08401826001600160a01b03169052565b5060c083015160c083015260e083015160e083015261010080840151818401525061012080840151818401525092915050565b60008251611b9d81846020870161164c565b9190910192915050565b600060208284031215611bb957600080fd5b8151611207816118e056fea26469706673582212200926bc0195f13380b709cb63f3ff7452ebaf4d2a688d110dbb28d09a980aeb4664736f6c63430008090033`,
  BytecodeLen: 8107,
  Which: `oD`,
  version: 6,
  views: {
    Auction: {
      currentPrice: `Auction_currentPrice`,
      endSecs: `Auction_endSecs`,
      highestBidder: `Auction_highestBidder`,
      token: `Auction_token`
      }
    }
  };
export const _Connectors = {
  ALGO: _ALGO,
  ETH: _ETH
  };
export const _Participants = {
  "Auctioneer": Auctioneer,
  "Bidder_close": Bidder_close,
  "Bidder_getBid": Bidder_getBid
  };
export const _APIs = {
  Bidder: {
    close: Bidder_close,
    getBid: Bidder_getBid
    }
  };
