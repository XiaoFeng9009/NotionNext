import { ChevronDoubleRight } from '@/components/HeroIcons'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useState } from 'react'

/**
 * 数字翻页插件
 * @param page 当前页码
 * @param totalPage 总页数
 * @returns {JSX.Element}
 * @constructor
 */
const PaginationNumber = ({ page, totalPage }) => {
  const router = useRouter()
  const [value, setValue] = useState('')
  const { locale } = useGlobal()
  const currentPage = +page
  const showNext = page < totalPage
  const showPrev = currentPage !== 1
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')
  const pages = generatePages(pagePrefix, page, currentPage, totalPage)
  
  if (pages?.length <= 1) {
    return <></>
  }

  const handleInputChange = event => {
    const newValue = event.target.value.replace(/[^0-9]/g, '')
    setValue(newValue)
  }

  /**
   * 跳转到指定页
   */
  const jumpToPage = () => {
    if (value && value >= 1 && value <= totalPage) {
      router.push(
        value == 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${value}`
      )
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      jumpToPage()
    }
  }

  return (
    <>
      {/* PC端分页按钮 */}
      <div className='hidden md:flex justify-center items-center my-10 font-medium text-black dark:text-gray-100 space-x-2'>
        {/* 上一页 */}
        <SmartLink
          href={{
            pathname:
              currentPage === 2
                ? `${pagePrefix}/`
                : `${pagePrefix}/page/${currentPage - 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          rel='prev'
          className={`${showPrev ? 'visible' : 'invisible'}`}>
          <div className='px-4 py-2 border-b-2 border-transparent hover:border-black dark:hover:border-white transition-all duration-200 cursor-pointer'>
            ←{locale.PAGINATION.PREV}
          </div>
        </SmartLink>

        {/* 分页按钮 */}
        <div className='flex items-center space-x-2'>
          {pages}
        </div>

        {/* 下一页 */}
        <SmartLink
          href={{
            pathname: `${pagePrefix}/page/${currentPage + 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          rel='next'
          className={`${showNext ? 'visible' : 'invisible'}`}>
          <div className='px-4 py-2 border-b-2 border-transparent hover:border-black dark:hover:border-white transition-all duration-200 cursor-pointer'>
            {locale.PAGINATION.NEXT}→
          </div>
        </SmartLink>

        {/* 跳转页码输入框 */}
        <div className='ml-4 flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 transition-all duration-200 hover:border-black dark:hover:border-white'>
          <input
            type='text'
            value={value}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder='页码'
            className='w-16 bg-transparent border-none outline-none text-center text-sm'
          />
          <div
            onClick={jumpToPage}
            className='cursor-pointer text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors'>
            <ChevronDoubleRight className='w-4 h-4' />
          </div>
        </div>
      </div>

      {/* 移动端分页 */}
      <div className='md:hidden flex justify-between my-10 font-medium text-black dark:text-gray-100 space-x-2'>
        {/* 上一页 */}
        <SmartLink
          href={{
            pathname:
              currentPage === 2
                ? `${pagePrefix}/`
                : `${pagePrefix}/page/${currentPage - 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          rel='prev'
          className={`${
            showPrev ? 'visible' : 'invisible'
          } text-center w-full duration-200 px-4 py-2 hover:border-black dark:hover:border-white border-b-2 hover:font-bold`}>
          ←{locale.PAGINATION.PREV}
        </SmartLink>
        
        {/* 页码指示 */}
        <div className='text-center px-4 py-2 text-gray-600 dark:text-gray-400'>
          {currentPage} / {totalPage}
        </div>

        {/* 下一页 */}
        <SmartLink
          href={{
            pathname: `${pagePrefix}/page/${currentPage + 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          rel='next'
          className={`${
            showNext ? 'visible' : 'invisible'
          } text-center w-full duration-200 px-4 py-2 hover:border-black dark:hover:border-white border-b-2 hover:font-bold`}>
          {locale.PAGINATION.NEXT}→
        </SmartLink>
      </div>
    </>
  )
}

/**
 * 页码按钮
 * @param {number} page 页码
 * @param {number} currentPage 当前页码
 * @param {string} pagePrefix 页面路径前缀
 * @returns {JSX.Element}
 */
function getPageElement(page, currentPage, pagePrefix) {
  const selected = page + '' === currentPage + ''
  if (!page) {
    return <></>
  }
  return (
    <SmartLink
      href={page === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${page}`}
      key={page}
      passHref
      className={
        (selected
          ? 'border-b-2 border-black dark:border-white font-bold'
          : 'border-b-2 border-transparent hover:border-gray-400 dark:hover:border-gray-500') +
        ' px-3 py-2 transition-all duration-200 cursor-pointer'
      }>
      {page}
    </SmartLink>
  )
}

/**
 * 生成所有页码
 * @param {string} pagePrefix 页面路径前缀
 * @param {number} page 当前页码
 * @param {number} currentPage 当前页码
 * @param {number} totalPage 总页数
 * @returns {Array<JSX.Element>}
 */
function generatePages(pagePrefix, page, currentPage, totalPage) {
  const pages = []
  const groupCount = 7 // 最多显示页签数
  
  if (totalPage <= groupCount) {
    // 总页数小于等于7，全部显示
    for (let i = 1; i <= totalPage; i++) {
      pages.push(getPageElement(i, page, pagePrefix))
    }
  } else {
    // 总页数大于7，智能显示
    pages.push(getPageElement(1, page, pagePrefix))
    const dynamicGroupCount = groupCount - 2
    let startPage = currentPage - 2
    
    if (startPage <= 1) {
      startPage = 2
    }
    if (startPage + dynamicGroupCount > totalPage) {
      startPage = totalPage - dynamicGroupCount
    }
    
    if (startPage > 2) {
      pages.push(
        <div key={-1} className='px-2 text-gray-400 dark:text-gray-600'>
          ...
        </div>
      )
    }

    for (let i = 0; i < dynamicGroupCount; i++) {
      if (startPage + i < totalPage) {
        pages.push(getPageElement(startPage + i, page, pagePrefix))
      }
    }

    if (startPage + dynamicGroupCount < totalPage) {
      pages.push(
        <div key={-2} className='px-2 text-gray-400 dark:text-gray-600'>
          ...
        </div>
      )
    }

    pages.push(getPageElement(totalPage, page, pagePrefix))
  }
  
  return pages
}

export default PaginationNumber
