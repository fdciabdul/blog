import PropTypes from 'prop-types'
import { Spin, Timeline as AntTimeline } from 'antd'
import { handleTagContent, utc2locale } from '@/core/util'
import { useEffect, useState } from 'react'
import { timelineQuery } from '@/constants/ConstTypes'
import Link from 'next/link'

const { Item } = AntTimeline

const getLink = (tag, number) => {
  const res = {
    href: '',
    as: ''
  }

  switch (tag) {
    case 'ABOUT':
      res.href = '/about'
      res.as = '/about'
      break
    default:
      res.href = '/post/[number]'
      res.as = `/post/${number}`
      break
  }

  return res
}

const Timeline = ({
  currentList,
  currentPage,
  open_issues_count,
  saveTimeline,
  fetchBlogInfo,
  fetchTimeline
}) => {
  const [timeLineMode, setTimeLineMode] = useState('alternate')
  const [showSeeMore, setShowSeeMore] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchList = async reqData => {
    setLoading(true)
    fetchTimeline(reqData, list => {
      saveTimeline({
        currentList: currentList.concat(list),
        currentPage: reqData.page
      })
      setLoading(false)
    })
  }

  const handleSeeMoreClick = () => {
    const nextReqData = {
      ...timelineQuery,
      page: currentPage + 1
    }
    fetchList(nextReqData)
  }

  useEffect(() => {
    const deviceWidth = window.screen.width || 0
    setTimeLineMode(deviceWidth && deviceWidth < 768 ? 'left' : 'alternate')

    if (!currentList.length) {
      fetchBlogInfo()
      fetchList(timelineQuery)
    }
  }, [])

  return (
    <Spin spinning={currentList.length === 0}>
      <div className='wrapper'>
        <AntTimeline mode={timeLineMode}>
          {currentList.map(item => {
            const {
              number,
              title,
              created_at,
              body,
              labels: [label]
            } = item
            let images = handleTagContent(body, 'image')
            const tag = label ? label.name.toUpperCase() : 'POST'
            if (images) {
              images = images.split('--split--')
            }
            return (
              <Item key={title}>
                <Link {...getLink(tag, number)}>
                  <a target='_self'>
                    <div>
                      <span className='type'>{tag}</span>
                      <span className='title'>{title}</span>
                      <br />
                      <span className='time'>{utc2locale(created_at)}</span>
                      <p className='content'>{handleTagContent(body)}</p>
                      {Array.isArray(images)
                        ? images.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt='url'
                            className='image'
                          />
                          ))
                        : null}
                    </div>
                  </a>
                </Link>
              </Item>
            )
          })}
          {currentPage >
          Math.ceil(open_issues_count / timelineQuery.per_page) - 1 ? (
            <Item>
              <span className='type'>DEPLOY</span>
              <a onClick={() => setShowSeeMore(!showSeeMore)}>
                <span className='title'>hexh's blog deployed.</span>
                <br />
                <span className='time'>2020/4/26 Monday</span>
              </a>
            </Item>
              ) : (
                <Spin spinning={loading}>
                  <div className='see_more'>
                    <a onClick={handleSeeMoreClick}>See more...</a>
                  </div>
                </Spin>
              )}
        </AntTimeline>
      </div>
      <style jsx>{`
        .title {
          font-weight: bold;
        }

        .type {
          cursor: default;
          font-weight: bold;
          color: rgba(0, 0, 0, 0.15);
          margin-right: 10px;
        }

        .time {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }

        .content {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          color: rgba(0, 0, 0, 0.65);
          text-overflow: ellipsis;
        }

        .see_more {
          margin-top: 10px;
          width: 100%;
          display: fles;
          justify-content: center;
        }

        .image {
          width: 100px;
          margin: 0 10px 10px 0;
        }

        .wrapper {
          padding-top: 25px;
        }
      `}
      </style>
    </Spin>
  )
}

export default Timeline

Timeline.propTypes = {
  currentList: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  open_issues_count: PropTypes.number.isRequired,
  saveTimeline: PropTypes.func.isRequired,
  fetchBlogInfo: PropTypes.func.isRequired,
  fetchTimeline: PropTypes.func.isRequired
}
