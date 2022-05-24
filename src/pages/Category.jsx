import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import {collection, getDocs, query, where, orderBy, limit, startAfter} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

const Category = () => {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)

    const params = useParams()

    useEffect(()=> {
        const fetchListings = async () => {
            try {
                //get a refrence
                const listingRef = collection(db, 'listings')

                //create a query  * categoryName is refering to the '/category/:categoryName' in App.js*
                //limit(10) is the amount that will be displayed on the page
                const q = query(
                    listingRef, 
                    where('type', '==', params.categoryName), 
                    orderBy('timestamp', 'desc'),
                    limit(10)
                    )

                //execute query
                const querySnap = await getDocs(q)

                const lastVisable = querySnap.docs[querySnap.docs.length-1]
                setLastFetchedListing(lastVisable)

                const listings = []

                querySnap.forEach((doc)=> {
                    return listings.push({
                        // id is not in json. you get id with doc.id
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setListings(listings)
                setLoading(false)
            } catch (error) {
                toast.error('could not fetch listings')
            }
        }

        fetchListings()
    },[params.categoryName])

    //pagination / Load More
        const onFetchMoreListings = async () => {
            try {
                //get a refrence
                const listingRef = collection(db, 'listings')

                //create a query  * categoryName is refering to the '/category/:categoryName' in App.js*
                //limit(10) is the next 10 listing when "load more" button is clocked
                const q = query(
                    listingRef, 
                    where('type', '==', params.categoryName), 
                    orderBy('timestamp', 'desc'),
                    startAfter(lastFetchedListing),
                    limit(10)
                    )

                //execute query
                const querySnap = await getDocs(q)

                const lastVisable = querySnap.docs[querySnap.docs.length-1]
                setLastFetchedListing(lastVisable)

                const listings = []

                querySnap.forEach((doc)=> {
                    return listings.push({
                        // id is not in json. you get id with doc.id
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setListings((prevState) => [...prevState, ...listings])
                setLoading(false)
            } catch (error) {
                toast.error('could not fetch listings')
            }
        }


    return (
    <div className='category'>
        <header>
            <p className="pageHeader">
                {params.categoryName === 'rent' 
                ? 'Places for rent' 
                : 'Places for sale'}
            </p>
        </header>

        {loading 
        ? <Spinner /> 
        : listings && listings.length > 0 
        ? <>
            <main>
                <ul className="categoryListings">
                    {listings.map((listing) => (
                        <ListingItem 
                            listing={listing.data} 
                            id={listing.id} 
                            key={listing.id} 
                            />
                    ))}
                </ul>
            </main>

            <br />
            <br />
            {lastFetchedListing && (
                <p className="loadMore" onClick={onFetchMoreListings}>Load More</p>
            )}
        </> 
        : <p>No listings for {params.categoryName}</p>}
    </div>
    )
}

export default Category