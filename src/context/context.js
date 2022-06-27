import React, { useState, useEffect, useContext } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const rootUrl = 'https://api.github.com'

const GithubContext = React.createContext()

export const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [repos, setRepos] = useState(mockRepos)
  const [followers, setFollowers] = useState(mockFollowers)
  //request loading
  const [requests, setRequests] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  //error
  const [error, setError] = useState({ show: false, msg: '' })

  // https://api.github.com/users/wesbos
  const searchGithubUser = async (user) => {
    toggleError()
    setIsLoading(true)
    try {
      //user
      const response = await axios(`${rootUrl}/users/${user}`)
      setGithubUser(response.data)
      const { login, followers_url } = response.data
      //repos
      const promiseRepos = axios(`${rootUrl}/users/${login}/repos?per_page=100`)
      //followers
      const promiseFollowers = axios(`${followers_url}?per_page=100`)
      await Promise.allSettled([promiseRepos, promiseFollowers])
        .then((results) => {
          console.log(results)
          const [repos, followers] = results
          const status = 'fulfilled'
          if (repos.status === status) {
            setRepos(repos.value.data)
          }
          if (followers.status === status) {
            setFollowers(followers.value.data)
          }
        })
        .catch((error) => console.log(error))
    } catch (error) {
      toggleError(true, '沒找到此人')
    }
    setIsLoading(false)
  }

  // check request rate
  const checkRequests = async () => {
    try {
      const { remaining } = await (await axios(`${rootUrl}/rate_limit`)).data
        .rate
      setRequests(remaining)
      if (remaining === 0) {
        toggleError(true, '請求數用完了')
      }
    } catch (error) {
      console.log(error.response)
    }
  }
  const toggleError = (show = false, msg = '') => {
    setError({ show, msg })
  }
  //error
  useEffect(() => {
    checkRequests()
  }, [githubUser])

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        setGithubUser,
        repos,
        setRepos,
        followers,
        setFollowers,
        requests,
        isLoading,
        setIsLoading,
        error,
        searchGithubUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}

export const useGithubContext = () => {
  return useContext(GithubContext)
}
