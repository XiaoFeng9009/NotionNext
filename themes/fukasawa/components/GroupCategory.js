import SmartLink from '@/components/SmartLink'
import { groupCategoriesByFirstLetter } from '@/lib/utils'

function GroupCategory ({ currentCategory, categories }) {
  if (!categories) {
    return <></>
  }

  // 按首字母对分类进行分组
  const groupedCategories = groupCategoriesByFirstLetter(categories)

  return <>
    <details className="group cursor-pointer">
      <summary className="list-none py-2 px-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium flex items-center">
        <i className="fas fa-chevron-right mr-2 group-open:rotate-90 transition-transform duration-200 text-xs" />
        <span>工作室or设计师</span>
        <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5">
          {categories.length}
        </span>
      </summary>
    
      <div id='category-list' className='dark:border-gray-600 flex flex-col'>
        {Object.entries(groupedCategories).map(([letter, letterCategories]) => (
          <div key={letter} className="py-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase px-2 py-1">{letter}</div>
            <div className="flex flex-col ml-4">
              {letterCategories.map(category => {
                const selected = currentCategory === category.name
                return (
                  <SmartLink
                    key={category.name}
                    href={`/category/${category.name}`}
                    passHref
                    className={(selected
                      ? 'hover:text-white dark:hover:text-white bg-gray-600 text-white '
                      : 'dark:text-gray-400 text-gray-500 hover:text-white hover:bg-gray-500 dark:hover:text-white') +
                      '  text-sm w-full items-center duration-300 px-2  cursor-pointer py-1 font-light'}>
                    
                    <i className={`${selected ? 'text-white fa-folder-open' : 'fa-folder text-gray-400'} fas mr-2`} />{category.name}({category.count})
                  </SmartLink>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </details>
  </>
}

export default GroupCategory
