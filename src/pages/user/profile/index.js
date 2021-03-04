import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import defaultAvatar from '@assets/default-avatar.png'
import bg from './assets/bg.png'
import qrCode from './assets/qr-code.png'
import level01 from './assets/level-01.png'
import './index.scss'

export default class Profile extends Component {
  static defaultProps = {
    userInfo: {},
    loginInfo: {},
  }

  handleLogin = () => {
    if (!this.props.loginInfo.token) {
      Taro.navigateTo({
        url: '/pages/user-login/user-login'
      })
    }
  }

  getUid = (uid) => {
    if (!uid || !/@/.test(uid)) {
      return ''
    }
    const [username, suffix] = uid.split('@')
    const firstLetter = username[0]
    const lastLetter = username[username.length - 1]
    return `${firstLetter}****${lastLetter}@${suffix}`
  }

  render () {
    const { userInfo, loginInfo } = this.props

    return (
      <View className='user-profile'>
        {/* // NOTE 背景图片：Image 标签 + position absolute 实现 */}
        <Image
          className='user-profile__bg'
          src={bg}
          mode='widthFix'
        />

        <View className='user-profile__wrap'>
          <View className='user-profile__avatar'>
            <Image
              className='user-profile__avatar-img'
              src={userInfo.avatarUrl || defaultAvatar}
              onClick={this.handleLogin}
            />
          </View>

          <View className='user-profile__info' onClick={this.handleLogin}>
            <Text className='user-profile__info-name'>
              {loginInfo.token ? userInfo.nickName : '未登录'}
            </Text>
            {loginInfo.token ?
              <View className='user-profile__info-wrap'>
                <Text className='user-profile__info-uid'>
                  {/* {this.getUid(userInfo.uid)} */}
                </Text>
              </View> :
              <Text className='user-profile__info-tip'>点击登录账号</Text>
            }
          </View>
        </View>
      </View>
    )
  }
}
