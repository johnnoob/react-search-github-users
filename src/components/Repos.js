import React from 'react'
import styled from 'styled-components'
import { useGithubContext } from '../context/context'
import { ExampleChart, Pie2D, Column3D, Bar3D, Doughnut2D } from './Charts'
const Repos = () => {
  const { repos } = useGithubContext()
  const languages = repos.reduce((repoSet, repo) => {
    const { language, stargazers_count } = repo
    if (!language) return repoSet
    if (!repoSet[language]) {
      repoSet[language] = { label: language, value: 1, stars: stargazers_count }
    } else {
      repoSet[language] = {
        ...repoSet[language],
        value: (repoSet[language].value += 1),
        stars: repoSet[language].stars + stargazers_count,
      }
    }
    return repoSet
  }, {})

  const transformData = (languages, prop) => {
    return Object.values(languages)
      .sort((a, b) => {
        return b[prop] - a[prop]
      })
      .slice(0, 5)
  }

  const mostUsed = transformData(languages, 'value')

  const mostPopular = transformData(languages, 'stars').map((item) => {
    return { ...item, value: item.stars }
  })

  //stars and forks
  let { stars, forks } = repos.reduce(
    (total, item) => {
      const { name, stargazers_count, forks_count } = item
      total.stars[name] = { label: name, value: stargazers_count }
      total.forks[name] = { label: name, value: forks_count }
      return total
    },
    {
      stars: {},
      forks: {},
    },
  )

  stars = Object.values(stars)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
  forks = Object.values(forks)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie2D data={mostUsed} />
        <Column3D data={stars} />
        <Doughnut2D data={mostPopular} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  )
}

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`

export default Repos
