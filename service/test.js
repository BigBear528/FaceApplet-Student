import dxRequest from './index'

export function test(){
  return dxRequest.get("/queryUserList")
}