import { color_primary } from '@/constants/CustomTheme'
import { useState, useEffect } from 'react'
import { Button, Input, Dropdown, Menu, Drawer } from 'antd'
import PropTypes from 'prop-types'
import { blogName, contactTypes, pagesIndex, archieveUrl } from '@/constants/ConstTypes'
import Link from 'next/link'
import SearchOutlined from '@ant-design/icons/SearchOutlined'
import MenuOutlined from '@ant-design/icons/MenuOutlined'
import CaretDownOutlined from '@ant-design/icons/CaretDownOutlined'
import { handleLink } from '@/core/util'
import Router from 'next/router'

const Item = Menu.Item
const [OPENED_SEARCH_BAR_WIDTH, CLOSED_SEARCH_BAR_WIDTH] = [250, 37]
const mapPagesIndex = (() => {
  const obj = {}
  pagesIndex.forEach(item => (obj[item.key] = item.value))
  return obj
})()

const exec = string => {
  const reg = new RegExp('\\/([\\s\\S]+?)\\#')

  pagesIndex.some(({ key, value }) => {
    if (string === '/') {
      string = value
      return true
    } else if (key !== '/' && string.startsWith(key)) {
      string = value
      return true
    }
  })

  if (string.match(reg)) {
    return '/' + string.match(reg)[1]
    // .toLowerCase()
    // .replace(/( |^)[a-z]/g, L => L.toUpperCase())
  }

  return string
}

const _Menu = () => {
  return (
    <Menu onClick={linkTo}>
      {contactTypes.map(item => {
        const { text, link, Icon } = item
        return (
          <Menu.Item key={link} icon={<Icon />}>
            {text}
          </Menu.Item>
        )
      })}
    </Menu>
  )
}

const Navigation = ({
  currentPostListPage,
  openDrawer,
  changeSearchKeyword,
  searchKeyword
}) => {
  const [isShowTopShadow, setTopShadow] = useState(false)
  const [searchBarWidth, setSearchWidth] = useState(CLOSED_SEARCH_BAR_WIDTH)
  const [isShowBottomDrawer, setShowBottomDrawer] = useState(false)
  const [pathname, setPathname] = useState('/')
  let scrollTop = 0

  const setSearchBarOpen = () => {
    if (searchBarWidth === OPENED_SEARCH_BAR_WIDTH) {
      return null
    }
    setSearchWidth(OPENED_SEARCH_BAR_WIDTH)
  }

  const handleBottomDrawer = () => {
    setShowBottomDrawer(!isShowBottomDrawer)
  }

  const handleRoute = key => {
    if (key.indexOf('list') !== -1) {
      key = key + `?page=${currentPostListPage}`
    }
    return key
  }

  useEffect(() => {
    const _handlePathname = pathname => {
      setPathname(pathname)
    }

    window.addEventListener(
      'scroll',
      () => {
        const currtScrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0
        if (currtScrollTop > 0 && scrollTop === 0) {
          scrollTop = 1
          setTopShadow(true)
        } else if (currtScrollTop === 0 && scrollTop > 0) {
          scrollTop = 0
          setTopShadow(false)
        }
      },
      false
    )
    setPathname(window.location.pathname)
    Router.events.on('routeChangeComplete', _handlePathname)

    return () => {
      Router.events.off('routeChangeComplete', _handlePathname)
    }
  }, [])

  return (
    <div className='container'>
      <div className='navigation'>
        <div className='button-box'>
          <Button
            onClick={openDrawer}
            type='link'
            icon={<MenuOutlined />}
            size='large'
          />

          <Button type='link' size='large' onClick={handleBottomDrawer}>
            {mapPagesIndex[pathname] ? mapPagesIndex[pathname] : exec(pathname)}
            <CaretDownOutlined />
          </Button>
        </div>

        <Link href='/'>
          <div className='title'>{blogName}</div>
        </Link>

        <ul className='menu'>
          <li onClick={setSearchBarOpen} className='search'>
            <Input
              prefix={<SearchOutlined style={{ color: color_primary }} />}
              // onBlur={setSearchBarClose}
              // placeholder="Search for something interesting?"
              placeholder='Make your life easier...'
              onPressEnter={() => {
                Router.push(`/search#q=${searchKeyword}&page=1`)
              }}
              style={{ width: searchBarWidth }}
              value={searchKeyword}
              onChange={e => {
                if (
                  e.currentTarget &&
                  typeof e.currentTarget.value === 'string'
                ) {
                  changeSearchKeyword(e.currentTarget.value)
                }
              }}
            />
          </li>
          <Dropdown overlay={_Menu}>
            <li className='contact'>CONTACT</li>
          </Dropdown>
          <li className='contact' onClick={linkToArchive}>
            ARCHIVE
          </li>
        </ul>
      </div>

      <Drawer
        visible={isShowBottomDrawer}
        placement='bottom'
        onClose={handleBottomDrawer}
        closable={false}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ paddingLeft: 16, border: 0 }}
        title='Index'
        height={210}
      >
        <Menu selectedKeys={[exec(pathname)]} mode='vertical'>
          {pagesIndex.map(item => (
            <Item
              onClick={handleBottomDrawer}
              icon={<item.Icon />}
              key={item.value}
            >
              <Link href={handleRoute(item.key)}>
                <a target='_self'>{item.value}</a>
              </Link>
            </Item>
          ))}
        </Menu>
      </Drawer>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          z-index: 5;
          box-shadow: ${isShowTopShadow
            ? '0 2px 6px rgba(0, 0, 0, 0.35)'
            : 'null'};
          background-color: #fff;
          width: 100%;
        }

        .button-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .button-box:after {
          content: '';
          display: block;
          width: 40px;
        }

        .navigation {
          height: 46px;
          width: 100%;
          background-color: #fff;
          color: ${color_primary};
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1150px;
        }

        .menu {
          list-style: none;
          margin: 0;
        }

        .menu > li {
          display: inline-block;
          height: 100%;
          cursor: pointer;
        }

        .menu > li + li {
          margin-left: 20px;
        }

        .contact {
          line-height: 46px;
        }

        .title {
          cursor: pointer;
          font-size: 16px;
          color: ${color_primary};
        }

        @media (min-width: 768px) {
          .button-box {
            display: none;
          }

          .navigation {
            padding: 0 42px;
          }
        }

        @media (max-width: 767px) {
          .title {
            display: none;
          }

          .menu {
            display: none;
          }
        }

        :global(.navigation .ant-btn) {
          height: 46px;
        }

        :global(.navigation .ant-input-affix-wrapper) {
          border: ${searchBarWidth === OPENED_SEARCH_BAR_WIDTH ? 'null' : '0'};
          border-radius: 100px;
        }

        :global(.navigation .ant-input) {
          margin-left: 10px;
        }
      `}
      </style>
    </div>
  )
}

Navigation.propTypes = {
  openDrawer: PropTypes.func.isRequired,
  changeSearchKeyword: PropTypes.func.isRequired,
  searchKeyword: PropTypes.string.isRequired,
  currentPostListPage: PropTypes.number.isRequired
}

export default Navigation

const linkTo = ({ key }) => {
  handleLink(key)
}

const linkToArchive = () => {
  handleLink(archieveUrl)
}
