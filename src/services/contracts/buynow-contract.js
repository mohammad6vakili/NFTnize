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
      Listing: {
        currentPrice: {
          decode: async (i, svs, args) => {
            if (stdlib.eq(i, stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 1))) {
              const [v199, v200, v201] = svs;
              stdlib.assert(false, 'illegal view')
              }
            if (stdlib.eq(i, stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 4))) {
              const [v199, v200, v201, v213, v214, v216, v223, v224] = svs;
              return (await ((async () => {
                
                
                return v201;}))(...args));
              }
            
            stdlib.assert(false, 'illegal view')
            },
          ty: ctc2
          },
        token: {
          decode: async (i, svs, args) => {
            if (stdlib.eq(i, stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 1))) {
              const [v199, v200, v201] = svs;
              stdlib.assert(false, 'illegal view')
              }
            if (stdlib.eq(i, stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 4))) {
              const [v199, v200, v201, v213, v214, v216, v223, v224] = svs;
              return (await ((async () => {
                
                
                return v200;}))(...args));
              }
            
            stdlib.assert(false, 'illegal view')
            },
          ty: ctc1
          }
        }
      },
    views: {
      1: [ctc0, ctc1, ctc2],
      4: [ctc0, ctc1, ctc2, ctc0, ctc2, ctc2, ctc2, ctc2]
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
export async function Buyer_buyNFT(ctcTop, interact) {
  if (typeof(ctcTop) !== 'object' || ctcTop._initialize === undefined) {
    return Promise.reject(new Error(`The backend for Buyer_buyNFT expects to receive a contract as its first argument.`));}
  if (typeof(interact) !== 'object') {
    return Promise.reject(new Error(`The backend for Buyer_buyNFT expects to receive an interact object as its second argument.`));}
  const ctc = ctcTop._initialize();
  const stdlib = ctc.stdlib;
  const ctc0 = stdlib.T_Address;
  const ctc1 = stdlib.T_Token;
  const ctc2 = stdlib.T_UInt;
  const ctc3 = stdlib.T_Tuple([ctc2]);
  const ctc4 = stdlib.T_Data({
    Buyer_buyNFT0_54: ctc3,
    Buyer_close0_54: ctc3
    });
  const ctc5 = stdlib.T_Null;
  
  
  const [v199, v200, v201, v213, v214, v216, v223, v224] = await ctc.getState(stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 4), [ctc0, ctc1, ctc2, ctc0, ctc2, ctc2, ctc2, ctc2]);
  const v229 = stdlib.protect(ctc3, await interact.in(), {
    at: './buynow.rsh:1:23:application',
    fs: ['at ./buynow.rsh:83:9:application call to [unknown function] (defined at: ./buynow.rsh:83:9:function exp)', 'at ./buynow.rsh:71:19:application call to "runBuyer_buyNFT0_54" (defined at: ./buynow.rsh:82:11:function exp)', 'at ./buynow.rsh:71:19:application call to [unknown function] (defined at: ./buynow.rsh:71:19:function exp)'],
    msg: 'in',
    who: 'Buyer_buyNFT'
    });
  const v230 = v229[stdlib.checkedBigNumberify('./buynow.rsh:82:11:spread', stdlib.UInt_max, 0)];
  const v231 = stdlib.ge(v230, v214);
  stdlib.assert(v231, {
    at: './buynow.rsh:83:27:application',
    fs: ['at ./buynow.rsh:83:9:application call to [unknown function] (defined at: ./buynow.rsh:83:18:function exp)', 'at ./buynow.rsh:83:9:application call to [unknown function] (defined at: ./buynow.rsh:83:9:function exp)', 'at ./buynow.rsh:71:19:application call to "runBuyer_buyNFT0_54" (defined at: ./buynow.rsh:82:11:function exp)', 'at ./buynow.rsh:71:19:application call to [unknown function] (defined at: ./buynow.rsh:71:19:function exp)'],
    msg: 'offer is too low',
    who: 'Buyer_buyNFT'
    });
  
  const v243 = ['Buyer_buyNFT0_54', v229];
  
  const txn1 = await (ctc.sendrecv({
    args: [v199, v200, v201, v213, v214, v216, v223, v224, v243],
    evt_cnt: 1,
    funcNum: 3,
    lct: stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 0),
    onlyIf: true,
    out_tys: [ctc4],
    pay: [v230, []],
    sim_p: (async (txn1) => {
      const sim_r = { txns: [], mapRefs: [], maps: [] };
      
      const {data: [v248], secs: v250, time: v249, didSend: v142, from: v247 } = txn1;
      
      switch (v248[0]) {
        case 'Buyer_buyNFT0_54': {
          const v251 = v248[1];
          let v254;
          const v256 = v251[stdlib.checkedBigNumberify('./buynow.rsh:82:11:spread', stdlib.UInt_max, 0)];
          v254 = v256;
          const v260 = stdlib.add(v223, v254);
          sim_r.txns.push({
            amt: v254,
            kind: 'to',
            tok: undefined
            });
          undefined;
          const v263 = stdlib.ge(v256, v214);
          stdlib.assert(v263, {
            at: './buynow.rsh:86:18:application',
            fs: ['at ./buynow.rsh:85:9:application call to [unknown function] (defined at: ./buynow.rsh:85:9:function exp)'],
            msg: null,
            who: 'Buyer_buyNFT'
            });
          const v267 = stdlib.sub(v260, v216);
          sim_r.txns.push({
            amt: v216,
            kind: 'from',
            to: v213,
            tok: undefined
            });
          const v268 = null;
          const v269 = await txn1.getOutput('Buyer_buyNFT', 'v268', ctc5, v268);
          
          sim_r.txns.push({
            amt: v267,
            kind: 'from',
            to: v199,
            tok: undefined
            });
          sim_r.txns.push({
            amt: v224,
            kind: 'from',
            to: v247,
            tok: v200
            });
          sim_r.txns.push({
            kind: 'halt',
            tok: v200
            })
          sim_r.txns.push({
            kind: 'halt',
            tok: undefined
            })
          sim_r.isHalt = true;
          
          break;
          }
        case 'Buyer_close0_54': {
          const v284 = v248[1];
          
          break;
          }
        }
      return sim_r;
      }),
    soloSend: false,
    timeoutAt: undefined,
    tys: [ctc0, ctc1, ctc2, ctc0, ctc2, ctc2, ctc2, ctc2, ctc4],
    waitIfNotPresent: false
    }));
  const {data: [v248], secs: v250, time: v249, didSend: v142, from: v247 } = txn1;
  switch (v248[0]) {
    case 'Buyer_buyNFT0_54': {
      const v251 = v248[1];
      let v254;
      const v256 = v251[stdlib.checkedBigNumberify('./buynow.rsh:82:11:spread', stdlib.UInt_max, 0)];
      v254 = v256;
      const v260 = stdlib.add(v223, v254);
      ;
      undefined;
      const v263 = stdlib.ge(v256, v214);
      stdlib.assert(v263, {
        at: './buynow.rsh:86:18:application',
        fs: ['at ./buynow.rsh:85:9:application call to [unknown function] (defined at: ./buynow.rsh:85:9:function exp)'],
        msg: null,
        who: 'Buyer_buyNFT'
        });
      const v267 = stdlib.sub(v260, v216);
      ;
      const v268 = null;
      const v269 = await txn1.getOutput('Buyer_buyNFT', 'v268', ctc5, v268);
      if (v142) {
        stdlib.protect(ctc5, await interact.out(v251, v269), {
          at: './buynow.rsh:82:12:application',
          fs: ['at ./buynow.rsh:82:12:application call to [unknown function] (defined at: ./buynow.rsh:82:12:function exp)', 'at ./buynow.rsh:88:12:application call to "k" (defined at: ./buynow.rsh:85:9:function exp)', 'at ./buynow.rsh:85:9:application call to [unknown function] (defined at: ./buynow.rsh:85:9:function exp)'],
          msg: 'out',
          who: 'Buyer_buyNFT'
          });
        }
      else {
        }
      
      ;
      ;
      return;
      
      break;
      }
    case 'Buyer_close0_54': {
      const v284 = v248[1];
      return;
      break;
      }
    }
  
  
  };
export async function Buyer_close(ctcTop, interact) {
  if (typeof(ctcTop) !== 'object' || ctcTop._initialize === undefined) {
    return Promise.reject(new Error(`The backend for Buyer_close expects to receive a contract as its first argument.`));}
  if (typeof(interact) !== 'object') {
    return Promise.reject(new Error(`The backend for Buyer_close expects to receive an interact object as its second argument.`));}
  const ctc = ctcTop._initialize();
  const stdlib = ctc.stdlib;
  const ctc0 = stdlib.T_Address;
  const ctc1 = stdlib.T_Token;
  const ctc2 = stdlib.T_UInt;
  const ctc3 = stdlib.T_Tuple([ctc2]);
  const ctc4 = stdlib.T_Data({
    Buyer_buyNFT0_54: ctc3,
    Buyer_close0_54: ctc3
    });
  const ctc5 = stdlib.T_Null;
  
  
  const [v199, v200, v201, v213, v214, v216, v223, v224] = await ctc.getState(stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 4), [ctc0, ctc1, ctc2, ctc0, ctc2, ctc2, ctc2, ctc2]);
  const v237 = stdlib.protect(ctc3, await interact.in(), {
    at: './buynow.rsh:1:23:application',
    fs: ['at ./buynow.rsh:99:11:application call to [unknown function] (defined at: ./buynow.rsh:99:11:function exp)', 'at ./buynow.rsh:71:19:application call to "runBuyer_close0_54" (defined at: ./buynow.rsh:99:11:function exp)', 'at ./buynow.rsh:71:19:application call to [unknown function] (defined at: ./buynow.rsh:71:19:function exp)'],
    msg: 'in',
    who: 'Buyer_close'
    });
  
  const v245 = ['Buyer_close0_54', v237];
  
  const txn1 = await (ctc.sendrecv({
    args: [v199, v200, v201, v213, v214, v216, v223, v224, v245],
    evt_cnt: 1,
    funcNum: 3,
    lct: stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 0),
    onlyIf: true,
    out_tys: [ctc4],
    pay: [stdlib.checkedBigNumberify('./buynow.rsh:100:17:decimal', stdlib.UInt_max, 0), []],
    sim_p: (async (txn1) => {
      const sim_r = { txns: [], mapRefs: [], maps: [] };
      
      const {data: [v248], secs: v250, time: v249, didSend: v142, from: v247 } = txn1;
      
      switch (v248[0]) {
        case 'Buyer_buyNFT0_54': {
          const v251 = v248[1];
          
          break;
          }
        case 'Buyer_close0_54': {
          const v284 = v248[1];
          let v287;
          v287 = stdlib.checkedBigNumberify('./buynow.rsh:100:17:decimal', stdlib.UInt_max, 0);
          const v293 = stdlib.add(v223, v287);
          sim_r.txns.push({
            amt: v287,
            kind: 'to',
            tok: undefined
            });
          undefined;
          const v310 = null;
          const v311 = await txn1.getOutput('Buyer_close', 'v310', ctc5, v310);
          
          sim_r.txns.push({
            amt: v293,
            kind: 'from',
            to: v199,
            tok: undefined
            });
          sim_r.txns.push({
            amt: v224,
            kind: 'from',
            to: v213,
            tok: v200
            });
          sim_r.txns.push({
            kind: 'halt',
            tok: v200
            })
          sim_r.txns.push({
            kind: 'halt',
            tok: undefined
            })
          sim_r.isHalt = true;
          
          break;
          }
        }
      return sim_r;
      }),
    soloSend: false,
    timeoutAt: undefined,
    tys: [ctc0, ctc1, ctc2, ctc0, ctc2, ctc2, ctc2, ctc2, ctc4],
    waitIfNotPresent: false
    }));
  const {data: [v248], secs: v250, time: v249, didSend: v142, from: v247 } = txn1;
  switch (v248[0]) {
    case 'Buyer_buyNFT0_54': {
      const v251 = v248[1];
      return;
      break;
      }
    case 'Buyer_close0_54': {
      const v284 = v248[1];
      let v287;
      v287 = stdlib.checkedBigNumberify('./buynow.rsh:100:17:decimal', stdlib.UInt_max, 0);
      const v293 = stdlib.add(v223, v287);
      ;
      undefined;
      const v310 = null;
      const v311 = await txn1.getOutput('Buyer_close', 'v310', ctc5, v310);
      if (v142) {
        stdlib.protect(ctc5, await interact.out(v284, v311), {
          at: './buynow.rsh:99:12:application',
          fs: ['at ./buynow.rsh:99:12:application call to [unknown function] (defined at: ./buynow.rsh:99:12:function exp)', 'at ./buynow.rsh:102:12:application call to "k" (defined at: ./buynow.rsh:101:9:function exp)', 'at ./buynow.rsh:101:9:application call to [unknown function] (defined at: ./buynow.rsh:101:9:function exp)'],
          msg: 'out',
          who: 'Buyer_close'
          });
        }
      else {
        }
      
      ;
      ;
      return;
      
      break;
      }
    }
  
  
  };
export async function Seller(ctcTop, interact) {
  if (typeof(ctcTop) !== 'object' || ctcTop._initialize === undefined) {
    return Promise.reject(new Error(`The backend for Seller expects to receive a contract as its first argument.`));}
  if (typeof(interact) !== 'object') {
    return Promise.reject(new Error(`The backend for Seller expects to receive an interact object as its second argument.`));}
  const ctc = ctcTop._initialize();
  const stdlib = ctc.stdlib;
  const ctc0 = stdlib.T_UInt;
  const ctc1 = stdlib.T_Token;
  const ctc2 = stdlib.T_Object({
    salesPrice: ctc0,
    token: ctc1
    });
  const ctc3 = stdlib.T_Null;
  const ctc4 = stdlib.T_Tuple([ctc0]);
  const ctc5 = stdlib.T_Data({
    Buyer_buyNFT0_54: ctc4,
    Buyer_close0_54: ctc4
    });
  const ctc6 = stdlib.T_Address;
  
  
  const v196 = stdlib.protect(ctc2, await interact.getSale(), {
    at: './buynow.rsh:44:36:application',
    fs: ['at ./buynow.rsh:40:14:application call to [unknown function] (defined at: ./buynow.rsh:40:18:function exp)'],
    msg: 'getSale',
    who: 'Seller'
    });
  const v197 = v196.token;
  const v198 = v196.salesPrice;
  
  const txn1 = await (ctc.sendrecv({
    args: [v197, v198],
    evt_cnt: 2,
    funcNum: 0,
    lct: stdlib.checkedBigNumberify('./buynow.rsh:47:6:dot', stdlib.UInt_max, 0),
    onlyIf: true,
    out_tys: [ctc1, ctc0],
    pay: [stdlib.checkedBigNumberify('./buynow.rsh:47:6:decimal', stdlib.UInt_max, 0), []],
    sim_p: (async (txn1) => {
      const sim_r = { txns: [], mapRefs: [], maps: [] };
      
      const {data: [v200, v201], secs: v203, time: v202, didSend: v31, from: v199 } = txn1;
      
      sim_r.txns.push({
        amt: stdlib.checkedBigNumberify('<builtin>', stdlib.UInt_max, 0),
        kind: 'init',
        tok: v200
        });
      sim_r.txns.push({
        amt: stdlib.checkedBigNumberify('./buynow.rsh:47:6:decimal', stdlib.UInt_max, 0),
        kind: 'to',
        tok: undefined
        });
      sim_r.isHalt = false;
      
      return sim_r;
      }),
    soloSend: true,
    timeoutAt: undefined,
    tys: [ctc1, ctc0],
    waitIfNotPresent: false
    }));
  const {data: [v200, v201], secs: v203, time: v202, didSend: v31, from: v199 } = txn1;
  ;
  ;
  const txn2 = await (ctc.sendrecv({
    args: [v199, v200, v201],
    evt_cnt: 0,
    funcNum: 1,
    lct: v202,
    onlyIf: true,
    out_tys: [],
    pay: [stdlib.checkedBigNumberify('./buynow.rsh:52:6:dot', stdlib.UInt_max, 0), [[stdlib.checkedBigNumberify('./buynow.rsh:52:12:decimal', stdlib.UInt_max, 1), v200]]],
    sim_p: (async (txn2) => {
      const sim_r = { txns: [], mapRefs: [], maps: [] };
      
      const {data: [], secs: v207, time: v206, didSend: v39, from: v205 } = txn2;
      
      sim_r.txns.push({
        amt: stdlib.checkedBigNumberify('./buynow.rsh:52:6:dot', stdlib.UInt_max, 0),
        kind: 'to',
        tok: undefined
        });
      sim_r.txns.push({
        amt: stdlib.checkedBigNumberify('./buynow.rsh:52:12:decimal', stdlib.UInt_max, 1),
        kind: 'to',
        tok: v200
        });
      const v211 = stdlib.addressEq(v199, v205);
      stdlib.assert(v211, {
        at: './buynow.rsh:52:6:dot',
        fs: [],
        msg: 'sender correct',
        who: 'Seller'
        });
      
      const v213 = v199;
      const v214 = v201;
      const v215 = true;
      const v216 = stdlib.checkedBigNumberify('./buynow.rsh:74:7:decimal', stdlib.UInt_max, 0);
      const v217 = v206;
      const v223 = stdlib.checkedBigNumberify('./buynow.rsh:35:11:after expr stmt semicolon', stdlib.UInt_max, 0);
      const v224 = stdlib.checkedBigNumberify('./buynow.rsh:52:12:decimal', stdlib.UInt_max, 1);
      
      if (await (async () => {
        
        return v215;})()) {
        sim_r.isHalt = false;
        }
      else {
        sim_r.txns.push({
          amt: v223,
          kind: 'from',
          to: v199,
          tok: undefined
          });
        sim_r.txns.push({
          amt: v224,
          kind: 'from',
          to: v213,
          tok: v200
          });
        sim_r.txns.push({
          kind: 'halt',
          tok: v200
          })
        sim_r.txns.push({
          kind: 'halt',
          tok: undefined
          })
        sim_r.isHalt = true;
        }
      return sim_r;
      }),
    soloSend: true,
    timeoutAt: undefined,
    tys: [ctc6, ctc1, ctc0],
    waitIfNotPresent: false
    }));
  const {data: [], secs: v207, time: v206, didSend: v39, from: v205 } = txn2;
  ;
  ;
  const v211 = stdlib.addressEq(v199, v205);
  stdlib.assert(v211, {
    at: './buynow.rsh:52:6:dot',
    fs: [],
    msg: 'sender correct',
    who: 'Seller'
    });
  stdlib.protect(ctc3, await interact.signal(), {
    at: './buynow.rsh:55:36:application',
    fs: ['at ./buynow.rsh:55:14:application call to [unknown function] (defined at: ./buynow.rsh:55:18:function exp)'],
    msg: 'signal',
    who: 'Seller'
    });
  
  let v213 = v199;
  let v214 = v201;
  let v215 = true;
  let v216 = stdlib.checkedBigNumberify('./buynow.rsh:74:7:decimal', stdlib.UInt_max, 0);
  let v217 = v206;
  let v223 = stdlib.checkedBigNumberify('./buynow.rsh:35:11:after expr stmt semicolon', stdlib.UInt_max, 0);
  let v224 = stdlib.checkedBigNumberify('./buynow.rsh:52:12:decimal', stdlib.UInt_max, 1);
  
  while (await (async () => {
    
    return v215;})()) {
    const txn3 = await (ctc.recv({
      didSend: false,
      evt_cnt: 1,
      funcNum: 3,
      out_tys: [ctc5],
      timeoutAt: undefined,
      waitIfNotPresent: false
      }));
    const {data: [v248], secs: v250, time: v249, didSend: v142, from: v247 } = txn3;
    switch (v248[0]) {
      case 'Buyer_buyNFT0_54': {
        const v251 = v248[1];
        let v254;
        const v256 = v251[stdlib.checkedBigNumberify('./buynow.rsh:82:11:spread', stdlib.UInt_max, 0)];
        v254 = v256;
        const v260 = stdlib.add(v223, v254);
        ;
        undefined;
        const v263 = stdlib.ge(v256, v214);
        stdlib.assert(v263, {
          at: './buynow.rsh:86:18:application',
          fs: ['at ./buynow.rsh:85:9:application call to [unknown function] (defined at: ./buynow.rsh:85:9:function exp)'],
          msg: null,
          who: 'Seller'
          });
        const v267 = stdlib.sub(v260, v216);
        ;
        const v268 = null;
        await txn3.getOutput('Buyer_buyNFT', 'v268', ctc3, v268);
        const cv213 = v247;
        const cv214 = v256;
        const cv215 = false;
        const cv216 = v256;
        const cv217 = v249;
        const cv223 = v267;
        const cv224 = v224;
        
        v213 = cv213;
        v214 = cv214;
        v215 = cv215;
        v216 = cv216;
        v217 = cv217;
        v223 = cv223;
        v224 = cv224;
        
        continue;
        break;
        }
      case 'Buyer_close0_54': {
        const v284 = v248[1];
        let v287;
        v287 = stdlib.checkedBigNumberify('./buynow.rsh:100:17:decimal', stdlib.UInt_max, 0);
        const v293 = stdlib.add(v223, v287);
        ;
        undefined;
        const v310 = null;
        await txn3.getOutput('Buyer_close', 'v310', ctc3, v310);
        const cv213 = v213;
        const cv214 = v214;
        const cv215 = false;
        const cv216 = v216;
        const cv217 = v249;
        const cv223 = v293;
        const cv224 = v224;
        
        v213 = cv213;
        v214 = cv214;
        v215 = cv215;
        v216 = cv216;
        v217 = cv217;
        v223 = cv223;
        v224 = cv224;
        
        continue;
        break;
        }
      }
    
    }
  ;
  ;
  return;
  
  
  
  
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
int 16
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
pop
// "CheckPay"
// "./buynow.rsh:47:6:dot"
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
// "./buynow.rsh:47:6:dot"
// "[]"
txn Sender
load 255
itob
concat
load 254
itob
concat
int 1
bzero
dig 1
extract 0 48
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
pop
txna ApplicationArgs 2
dup
len
int 0
==
assert
pop
// "CheckPay"
// "./buynow.rsh:52:6:dot"
// "[]"
// "CheckPay"
// "./buynow.rsh:52:6:dot"
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
// "./buynow.rsh:52:6:dot"
// "[]"
load 255
txn Sender
==
assert
load 255
load 254
itob
concat
load 253
itob
concat
load 255
load 253
itob
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
int 4
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
extract 48 32
store 252
dup
int 80
extract_uint64
store 251
dup
int 88
extract_uint64
store 250
dup
int 96
extract_uint64
store 249
dup
int 104
extract_uint64
store 248
pop
txna ApplicationArgs 2
dup
len
int 9
==
assert
dup
store 247
pop
load 247
int 0
getbyte
int 0
==
bz l9_switchAfterBuyer_buyNFT0_54
load 247
extract 1 8
dup
store 246
btoi
dup
store 244
store 245
// "CheckPay"
// "./buynow.rsh:71:19:dot"
// "[]"
load 245
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
// Nothing
// "./buynow.rsh:86:18:application"
// "[at ./buynow.rsh:85:9:application call to [unknown function] (defined at: ./buynow.rsh:85:9:function exp)]"
load 244
load 251
>=
assert
load 250
dup
bz l11_makeTxnK
itxn_begin
itxn_field Amount
int pay
itxn_field TypeEnum
load 252
itxn_field Receiver
itxn_submit
int 0
l11_makeTxnK:
pop
byte base64(AAAAAAAAAQw=)
log // 8
byte base64()
load 255
load 254
itob
concat
load 253
itob
concat
txn Sender
load 244
itob
concat
int 0
itob // bool
substring 7 8
concat
load 244
itob
concat
global Round
itob
concat
load 249
load 245
+
load 250
-
itob
concat
load 248
itob
concat
b loopBody2
l9_switchAfterBuyer_buyNFT0_54:
load 247
int 0
getbyte
int 1
==
bz l12_switchAfterBuyer_close0_54
int 0
store 246
// "CheckPay"
// "./buynow.rsh:71:19:dot"
// "[]"
load 246
dup
bz l13_checkTxnK
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
l13_checkTxnK:
pop
byte base64(AAAAAAAAATY=)
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
load 251
itob
concat
int 0
itob // bool
substring 7 8
concat
load 250
itob
concat
global Round
itob
concat
load 249
load 246
+
itob
concat
load 248
itob
concat
b loopBody2
l12_switchAfterBuyer_close0_54:
l8_switchK:
l7_afterHandler3:
int 0
assert
loopBody2:
dup
extract 0 32
store 255
dup
int 32
extract_uint64
store 254
dup
extract 40 1
btoi
store 253
dup
int 41
extract_uint64
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
pop
dup
extract 0 32
store 248
dup
int 32
extract_uint64
store 247
dup
int 40
extract_uint64
store 246
pop
load 253
bz l14_ifF
load 248
load 247
itob
concat
load 246
itob
concat
load 255
concat
load 254
itob
concat
load 252
itob
concat
load 250
itob
concat
load 249
itob
concat
int 1
bzero
dig 1
extract 0 112
app_global_put
pop
int 4
store 1
global Round
store 2
txn OnCompletion
int NoOp
==
assert
b updateState
l14_ifF:
load 250
dup
bz l15_makeTxnK
itxn_begin
itxn_field Amount
int pay
itxn_field TypeEnum
load 248
itxn_field Receiver
itxn_submit
int 0
l15_makeTxnK:
pop
load 249
dup
bz l16_makeTxnK
itxn_begin
itxn_field AssetAmount
int axfer
itxn_field TypeEnum
load 255
itxn_field AssetReceiver
load 247
itxn_field XferAsset
itxn_submit
int 0
l16_makeTxnK:
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
load 247
itxn_field XferAsset
itxn_submit
int 0
l17_makeTxnK:
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
l18_makeTxnK:
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
  stateKeys: 1,
  stateSize: 112,
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
                "name": "v200",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "v201",
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
                "name": "v200",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "v201",
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
        "internalType": "struct T7",
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
                    "internalType": "enum _enum_T9",
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
                    "internalType": "struct T8",
                    "name": "_Buyer_buyNFT0_54",
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
                    "internalType": "struct T8",
                    "name": "_Buyer_close0_54",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct T9",
                "name": "v248",
                "type": "tuple"
              }
            ],
            "internalType": "struct T10",
            "name": "msg",
            "type": "tuple"
          }
        ],
        "indexed": false,
        "internalType": "struct T11",
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
    "name": "_reach_oe_v268",
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
    "name": "_reach_oe_v310",
    "type": "event"
  },
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_a0",
        "type": "uint256"
      }
    ],
    "name": "Buyer_buyNFT",
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
    "name": "Buyer_close",
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
    "name": "Listing_currentPrice",
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
    "name": "Listing_token",
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
        "internalType": "struct T7",
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
                    "internalType": "enum _enum_T9",
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
                    "internalType": "struct T8",
                    "name": "_Buyer_buyNFT0_54",
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
                    "internalType": "struct T8",
                    "name": "_Buyer_close0_54",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct T9",
                "name": "v248",
                "type": "tuple"
              }
            ],
            "internalType": "struct T10",
            "name": "msg",
            "type": "tuple"
          }
        ],
        "internalType": "struct T11",
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
  Bytecode: `0x6080604052604051620019be380380620019be83398101604081905262000026916200021f565b6000805543600355604080518251815260208084015180516001600160a01b03168284015201518183015290517fd68e12e6935e4ed8c9ea003b808cf6a3f538d7177f5b45038a0bdc8dbd841e149181900360600190a16200008b3415600962000118565b604080516060808201835260006020808401828152848601838152338087528884018051516001600160a01b0390811685529051850151835260019586905543909555875193840152905190921694810194909452519083015290608001604051602081830303815290604052600290805190602001906200010f92919062000142565b505050620002d4565b816200013e5760405163100960cb60e01b81526004810182905260240160405180910390fd5b5050565b828054620001509062000297565b90600052602060002090601f016020900481019282620001745760008555620001bf565b82601f106200018f57805160ff1916838001178555620001bf565b82800160010185558215620001bf579182015b82811115620001bf578251825591602001919060010190620001a2565b50620001cd929150620001d1565b5090565b5b80821115620001cd5760008155600101620001d2565b604080519081016001600160401b03811182821017156200021957634e487b7160e01b600052604160045260246000fd5b60405290565b600081830360608112156200023357600080fd5b6200023d620001e8565b835181526040601f19830112156200025457600080fd5b6200025e620001e8565b60208501519092506001600160a01b03811681146200027c57600080fd5b82526040939093015160208083019190915283015250919050565b600181811c90821680620002ac57607f821691505b60208210811415620002ce57634e487b7160e01b600052602260045260246000fd5b50919050565b6116da80620002e46000396000f3fe6080604052600436106100845760003560e01c80636009475e116100565780636009475e146101215780638323075714610134578063aa2711cc14610149578063ab53f2c614610169578063f09382f01461018c57005b80631e93b0f11461008d5780632c10a159146100b1578063394bcbe7146100c45780633ac47b1b146100f157005b3661008b57005b005b34801561009957600080fd5b506003545b6040519081526020015b60405180910390f35b61008b6100bf3660046111b7565b6101a1565b3480156100d057600080fd5b506100d96101d1565b6040516001600160a01b0390911681526020016100a8565b3480156100fd57600080fd5b5061011161010c3660046111cf565b610352565b60405190151581526020016100a8565b61008b61012f3660046111e8565b6103b6565b34801561014057600080fd5b5060015461009e565b34801561015557600080fd5b506101116101643660046111cf565b6103e2565b34801561017557600080fd5b5061017e610443565b6040516100a8929190611226565b34801561019857600080fd5b5061009e6104e0565b60408051808201909152600080825260208201526101cd6101c7368490038401846112d6565b8261065e565b5050565b60006001600054141561028e576000600280546101ed9061133a565b80601f01602080910402602001604051908101604052809291908181526020018280546102199061133a565b80156102665780601f1061023b57610100808354040283529160200191610266565b820191906000526020600020905b81548152906001019060200180831161024957829003601f168201915b505050505080602001905181019061027e919061138b565b905061028c60006008610830565b505b60046000541415610343576000600280546102a89061133a565b80601f01602080910402602001604051908101604052809291908181526020018280546102d49061133a565b80156103215780601f106102f657610100808354040283529160200191610321565b820191906000526020600020905b81548152906001019060200180831161030457829003601f168201915b50505050508060200190518101906103399190611401565b6020015192915050565b61034f60006008610830565b90565b6040805180820190915260008082526020820181905290610371610ffa565b610379611019565b6040805160208082018352878252838301919091526001835281518082019092528282528301526103aa8284610856565b50506020015192915050565b60408051808201909152600080825260208201526101cd6103dc3684900384018461151a565b82610856565b6040805180820190915260008082526020820181905290610401610ffa565b610409611019565b60408051602080820183528782528381019190915260008352815180820190925282825283015261043a8284610856565b50505192915050565b6000606060005460028080546104589061133a565b80601f01602080910402602001604051908101604052809291908181526020018280546104849061133a565b80156104d15780601f106104a6576101008083540402835291602001916104d1565b820191906000526020600020905b8154815290600101906020018083116104b457829003601f168201915b50505050509050915091509091565b60006001600054141561059d576000600280546104fc9061133a565b80601f01602080910402602001604051908101604052809291908181526020018280546105289061133a565b80156105755780601f1061054a57610100808354040283529160200191610575565b820191906000526020600020905b81548152906001019060200180831161055857829003601f168201915b505050505080602001905181019061058d919061138b565b905061059b60006007610830565b505b60046000541415610652576000600280546105b79061133a565b80601f01602080910402602001604051908101604052809291908181526020018280546105e39061133a565b80156106305780601f1061060557610100808354040283529160200191610630565b820191906000526020600020905b81548152906001019060200180831161061357829003601f168201915b50505050508060200190518101906106489190611401565b6040015192915050565b61034f60006007610830565b61066e600160005414600d610830565b815161068990158061068257508251600154145b600e610830565b60008080556002805461069b9061133a565b80601f01602080910402602001604051908101604052809291908181526020018280546106c79061133a565b80156107145780601f106106e957610100808354040283529160200191610714565b820191906000526020600020905b8154815290600101906020018083116106f757829003601f168201915b505050505080602001905181019061072c919061138b565b60408051855181526020808701511515908201529192507f79ca1a789d797004bc78dff9632d64e202e102f2d008dcc20c5a645ef7d4a7d1910160405180910390a161077a3415600a610830565b61079461078d3383602001516001610beb565b600b610830565b80516107ac906001600160a01b03163314600c610830565b6107b461105d565b815181516001600160a01b0391821690526020808401518351908316908201526040808501805185518301528551838601805191909516905251835190920191909152815160019101819052815160006060909101819052825143608090910152825160a00152905160c0015261082a81610c03565b50505050565b816101cd5760405163100960cb60e01b8152600481018290526024015b60405180910390fd5b6108666004600054146012610830565b815161088190158061087a57508251600154145b6013610830565b6000808055600280546108939061133a565b80601f01602080910402602001604051908101604052809291908181526020018280546108bf9061133a565b801561090c5780601f106108e15761010080835404028352916020019161090c565b820191906000526020600020905b8154815290600101906020018083116108ef57829003601f168201915b50505050508060200190518101906109249190611401565b905061094f604080516080810182526000606082018181528252602082018190529181019190915290565b7f2206f5c60f94d7fd6e082564e09cd08bafceb58e2319db26c381bd230fffbdcd8460405161097e91906115d2565b60405180910390a160006020850151515160018111156109a0576109a06114b4565b1415610aff5760208085015151810151808352519082018190526109c7903414600f610830565b60808201518151516109dc9111156010610830565b81606001516001600160a01b03166108fc8360a001519081150290604051600060405180830381858888f19350505050158015610a1d573d6000803e3d6000fd5b50604051600181527ff485b674e57aaedc9f946a69661caeedc414626df8f1efd54ccd3ee801c4981e9060200160405180910390a160018352610a5e61105d565b825181516001600160a01b039182169052602080850151835192169181019190915260408085015183518201528183018051339052845151815184015280516000920191909152835151815160600152514360809091015260a08401519083015160c0850151610ace919061163c565b610ad89190611654565b60208201805160a0019190915260e0840151905160c00152610af981610c03565b5061082a565b6001602085015151516001811115610b1957610b196114b4565b141561082a5760006040820152610b3234156011610830565b604051600181527f8ee5c92a06a56c70c2728e550ba3dcd59e9d2ab15395781c0c92775e5aeb0a849060200160405180910390a160016020840152610b7561105d565b825181516001600160a01b03918216905260208085015183519083169082015260408086015184518201526060808701518386018051919095169052608080880151855190940193909352835160009083015260a087015184519091015291514391015282015160c0840151610ad8919061163c565b6000610bf983853085610e00565b90505b9392505050565b80602001516040015115610d8157610c7460405180610100016040528060006001600160a01b0316815260200160006001600160a01b031681526020016000815260200160006001600160a01b03168152602001600081526020016000815260200160008152602001600081525090565b8151516001600160a01b0390811682528251602090810151821681840152835160409081015181850152818501805151909316606080860191909152835183015160808601528351015160a0808601919091528351015160c08086019190915292519092015160e08401526004600055436001559051610d589183910160006101008201905060018060a01b0380845116835280602085015116602084015260408401516040840152806060850151166060840152506080830151608083015260a083015160a083015260c083015160c083015260e083015160e083015292915050565b60405160208183030381529060405260029080519060200190610d7c9291906110d1565b505050565b805151602082015160a001516040516001600160a01b039092169181156108fc0291906000818181858888f19350505050158015610dc3573d6000803e3d6000fd5b50610de7816000015160200151826020015160000151836020015160c00151610eda565b60008080556001819055610dfd90600290611155565b50565b604080516001600160a01b0385811660248301528481166044830152606480830185905283518084039091018152608490920183526020820180516001600160e01b03166323b872dd60e01b179052915160009283928392918916918391610e679161166b565b60006040518083038185875af1925050503d8060008114610ea4576040519150601f19603f3d011682016040523d82523d6000602084013e610ea9565b606091505b5091509150610eba82826001610eee565b5080806020019051810190610ecf9190611687565b979650505050505050565b610ee5838383610f29565b610d7c57600080fd5b60608315610efd575081610bfc565b825115610f0d5782518084602001fd5b60405163100960cb60e01b81526004810183905260240161084d565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663a9059cbb60e01b179052915160009283928392918816918391610f889161166b565b60006040518083038185875af1925050503d8060008114610fc5576040519150601f19603f3d011682016040523d82523d6000602084013e610fca565b606091505b5091509150610fdb82826002610eee565b5080806020019051810190610ff09190611687565b9695505050505050565b60405180604001604052806000815260200161101461118f565b905290565b604080516060810190915280600081526020016110426040518060200160405280600081525090565b81526020016110146040518060200160405280600081525090565b6040805160a081018252600091810182815260608201839052608082019290925290819081526020016110146040518060e0016040528060006001600160a01b0316815260200160008152602001600015158152602001600081526020016000815260200160008152602001600081525090565b8280546110dd9061133a565b90600052602060002090601f0160209004810192826110ff5760008555611145565b82601f1061111857805160ff1916838001178555611145565b82800160010185558215611145579182015b8281111561114557825182559160200191906001019061112a565b506111519291506111a2565b5090565b5080546111619061133a565b6000825580601f10611171575050565b601f016020900490600052602060002090810190610dfd91906111a2565b6040518060200160405280611014611019565b5b8082111561115157600081556001016111a3565b6000604082840312156111c957600080fd5b50919050565b6000602082840312156111e157600080fd5b5035919050565b6000608082840312156111c957600080fd5b60005b838110156112155781810151838201526020016111fd565b8381111561082a5750506000910152565b828152604060208201526000825180604084015261124b8160608501602087016111fa565b601f01601f1916919091016060019392505050565b6040516020810167ffffffffffffffff8111828210171561129157634e487b7160e01b600052604160045260246000fd5b60405290565b6040516060810167ffffffffffffffff8111828210171561129157634e487b7160e01b600052604160045260246000fd5b8015158114610dfd57600080fd5b6000604082840312156112e857600080fd5b6040516040810181811067ffffffffffffffff8211171561131957634e487b7160e01b600052604160045260246000fd5b60405282358152602083013561132e816112c8565b60208201529392505050565b600181811c9082168061134e57607f821691505b602082108114156111c957634e487b7160e01b600052602260045260246000fd5b80516001600160a01b038116811461138657600080fd5b919050565b60006060828403121561139d57600080fd5b6040516060810181811067ffffffffffffffff821117156113ce57634e487b7160e01b600052604160045260246000fd5b6040526113da8361136f565b81526113e86020840161136f565b6020820152604083015160408201528091505092915050565b600061010080838503121561141557600080fd5b6040519081019067ffffffffffffffff8211818310171561144657634e487b7160e01b600052604160045260246000fd5b816040526114538461136f565b81526114616020850161136f565b60208201526040840151604082015261147c6060850161136f565b60608201526080840151608082015260a084015160a082015260c084015160c082015260e084015160e0820152809250505092915050565b634e487b7160e01b600052602160045260246000fd5b6000602082840312156114dc57600080fd5b6040516020810181811067ffffffffffffffff8211171561150d57634e487b7160e01b600052604160045260246000fd5b6040529135825250919050565b6000818303608081121561152d57600080fd5b6040516040810181811067ffffffffffffffff8211171561155e57634e487b7160e01b600052604160045260246000fd5b604052833581526060601f198301121561157757600080fd5b61157f611260565b9150611589611297565b60208501356002811061159b57600080fd5b81526115aa86604087016114ca565b60208201526115bc86606087016114ca565b6040820152825260208101919091529392505050565b8151815260208201515180516080830191906002811061160257634e487b7160e01b600052602160045260246000fd5b80602085015250602081015151604084015260408101515160608401525092915050565b634e487b7160e01b600052601160045260246000fd5b6000821982111561164f5761164f611626565b500190565b60008282101561166657611666611626565b500390565b6000825161167d8184602087016111fa565b9190910192915050565b60006020828403121561169957600080fd5b8151610bfc816112c856fea2646970667358221220bd4ab491921f6c9f991698bcbaf71ecc15b3961499871a0f8585d081e932d90c64736f6c63430008090033`,
  BytecodeLen: 6590,
  Which: `oD`,
  version: 6,
  views: {
    Listing: {
      currentPrice: `Listing_currentPrice`,
      token: `Listing_token`
      }
    }
  };
export const _Connectors = {
  ALGO: _ALGO,
  ETH: _ETH
  };
export const _Participants = {
  "Buyer_buyNFT": Buyer_buyNFT,
  "Buyer_close": Buyer_close,
  "Seller": Seller
  };
export const _APIs = {
  Buyer: {
    buyNFT: Buyer_buyNFT,
    close: Buyer_close
    }
  };
